import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { FindUserByEntrepreneurService } from "@modules/entrepreneurs/services/FindUserByEntrepreneurService";

export class FindUserByEntrepreneurController {

  public async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const findUserByEntrepreneurParamsSchema = z.object({
      id: z.string().uuid()
    });
    
    const { id } = findUserByEntrepreneurParamsSchema.parse(request.user);

    const findUserByEntrepreneurService = container.resolve(FindUserByEntrepreneurService);

    const entrepreneur = await findUserByEntrepreneurService.execute(id);

    return reply.status(201).send(entrepreneur);

  }
}