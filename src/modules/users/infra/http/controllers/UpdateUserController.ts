import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { UpdateUserService } from "@modules/users/services/UpdateUserService";

export class UpdateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const updateUserParamsSchema = z.object({
      id: z.string().uuid()
    });

    const updateUserBodySchema = z.object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.string().email("Invalid email format"),
      password: z.string().min(8, { message: "Password must be at least 8 characters long" })
    });

    const { id } = updateUserParamsSchema.parse(request.user);

    const { name, email, password } = updateUserBodySchema.parse(request.body);

    const updateUserService = container.resolve(
      UpdateUserService
    );

    const user = await updateUserService.execute({ id, name, email, password });

    return reply.send(user);
  }
}
