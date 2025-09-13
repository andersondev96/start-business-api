import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { FindFavoriteService } from "@modules/users/services/FindFavoriteService";

export class FindFavoriteController {

  public async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const findFavoriteParamsSchema = z.object({
      table_id: z.string().uuid("Invalid table ID format")
    });
    
    const { id } = request.user;

    const { table_id } = findFavoriteParamsSchema.parse(request.params);

    const findFavoriteService = container.resolve(FindFavoriteService);

    const favorite = await findFavoriteService.execute(id, table_id);

    return reply.status(201).send(favorite);
  }
}