
import type { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function ensureAuthenticated(request: FastifyRequest, response: FastifyReply) {

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing");
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      auth.secret_token
    ) as IPayload;

    request.user = {
      id: user_id
    };
  } catch {
    throw new AppError("Invalid token!");
  }
}