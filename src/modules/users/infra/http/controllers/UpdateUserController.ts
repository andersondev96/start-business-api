import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateUserService } from '@modules/users/services/UpdateUserService'

const updateUserParamsSchema = z.object({
  id: z.string().uuid(),
})

const updateUserBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 chars')
    .optional(),
})

export class UpdateUserController {
  async handle(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = updateUserParamsSchema.parse(request.user)

    const { name, email, password } = updateUserBodySchema.parse(request.body)

    const updateUserService = container.resolve(UpdateUserService)
    const user = await updateUserService.execute({ id, name, email, password })

    return reply.send(user)
  }
}
