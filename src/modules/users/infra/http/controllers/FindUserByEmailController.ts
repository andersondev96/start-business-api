import type { FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";

import { FindUserByEmailService } from "@modules/users/services/FindUserByEmailService";

export class FindUserByEmailController {

  public async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const findUserByEmailQuerySchema = z.object({
      email: z.string().email("Invalid email format")
    });

    const { email } = findUserByEmailQuerySchema.parse(request.query);

    const findUserByEmailService = container.resolve(FindUserByEmailService);

    const user = await findUserByEmailService.execute(String(email));

    return reply.status(200).send(user);
  }
}