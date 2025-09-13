import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { FindByUserIdService } from "@modules/users/services/FindByUserIdService";

export class FindByUserIdController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    
    const findByUserIdParamsSchema = z.object({
      id: z.string().uuid()
    });
    
    const { id } = findByUserIdParamsSchema.parse(request.user);

    const findByUserIdService = container.resolve(
      FindByUserIdService
    );

    const user = await findByUserIdService.execute(id);

    return reply.send(user);
  }
}
