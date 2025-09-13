import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { AuthenticateUserService } from "@modules/users/services/AuthenticateUserService";

export class AuthenticateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const authenticateUserParamsSchema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, { message: "Password must be at least 8 characters long" })
    });

    const { email, password } = authenticateUserParamsSchema.parse(request.body);

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const user = await authenticateUserService.execute({
      email,
      password
    });

    return reply.send(user);
  }
}
