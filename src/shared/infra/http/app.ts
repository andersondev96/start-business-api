import "@shared/container";
import fastify from "fastify";
import { createServer } from "http";
import path from "path";
import { Server, Socket } from "socket.io";
import { ZodError } from "zod";

import upload from "@config/upload";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import * as Sentry from "@sentry/node";
import { AppError } from "@shared/errors/AppError";

import routes from "./routes";

const app = fastify();
// app.use(express.static(path.join(__dirname, "..", "..", "..", "..", "public")));

// app.use(rateLimiter);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
  ],
  tracesSampleRate: 1.0
});

app.addHook("onRequest", async (request, reply) => {
  Sentry.Handlers.requestHandler()(request.raw, reply.raw, () => {});
});

const http = createServer(app.server);
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: Socket) => {
  console.log("Socket", socket.id);
});

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
});

// Swagger
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "API",
      description: "API",
      version: "1.0.0"
    }
  }
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

app.register(fastifySwaggerUi, {
  routePrefix: "/api-docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false
  }
});

// Static files
app.register(fastifyStatic, {
  root: path.join(upload.tmpFolder, "avatar"),
  prefix: "/avatar/"
});

app.register(fastifyStatic, {
  root: path.join(upload.tmpFolder, "company"),
  prefix: "/company/"
});

app.register(fastifyStatic, {
  root: path.join(upload.tmpFolder, "budgets"),
  prefix: "/budgets/"
});

app.register(fastifyStatic, {
  root: path.join(upload.tmpFolder, "service"),
  prefix: "/service/"
});

app.register(fastifyStatic, {
  root: path.join(upload.tmpFolder, "company_logo"),
  prefix: "/company_logo/"
});

app.register(routes);

app.setErrorHandler((error, request, reply) => {
  Sentry.captureException(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      status: "error",
      message: error.errors.map(e => e.message).join(", ")
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message
    });
  }

  return reply.status(500).send({
    status: "error",
    message: "Internal server error"
  });
});


export { http, io };
