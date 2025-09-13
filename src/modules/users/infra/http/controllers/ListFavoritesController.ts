import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { ListFavoritesService } from "@modules/users/services/ListFavoritesService";

export class ListFavoritesController {

  public async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const listFavoritesParamsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = listFavoritesParamsSchema.parse(request.params);

    const listFavoritesService = container.resolve(ListFavoritesService);

    const favorites = await listFavoritesService.execute(id);

    return reply.status(201).send(favorites);
  }
}