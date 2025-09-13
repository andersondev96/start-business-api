import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { DeleteUserService } from "@modules/users/services/DeleteUserService";

export class DeleteUserController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {

    const deleteUserParamsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = deleteUserParamsSchema.parse(request.user);

    const deleteUserService = container.resolve(
      DeleteUserService
    );

    await deleteUserService.execute(id);

    return reply.send().status(200);
  }
}
