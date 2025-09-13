import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { GoogleAuthenticationService } from "@modules/users/services/GoogleAuthenticationService";

export class GoogleAuthenticationController {

  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const googleAuthenticationParamsSchema = z.object({
      name: z.string({ message: "Name is required" }).min(1, { message: "Name is required" }),
      email: z.string().email("Invalid email format"),
      avatar: z.string().url("Invalid URL format").optional()
    });
    const { name, email, avatar } = googleAuthenticationParamsSchema.parse(request.body);

    const googleAuthenticationService = container.resolve(GoogleAuthenticationService);

    const auth = await googleAuthenticationService.execute({
      name,
      email,
      avatar
    });

    return reply.status(201).send(auth);
  }
}