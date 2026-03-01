import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { FindUserByIdService } from '@modules/users/services/FindUserByIdService'

export class FindUserByIdController {
  async handle(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const findByUserIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = findByUserIdParamsSchema.parse(request.user)

    const findUserByIdService = container.resolve(FindUserByIdService)

    const user = await findUserByIdService.execute(id)

    return reply.send(user)
  }
}
