import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GoogleAuthenticationService } from '@modules/users/services/GoogleAuthenticationService'

const googleAuthBodySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, { message: 'Name must not be empty' }),
  email: z.string().email('Invalid email format'),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
})

type GoogleAuthBody = z.infer<typeof googleAuthBodySchema>

export class GoogleAuthenticationController {
  async handle(
    request: FastifyRequest<{ Body: GoogleAuthBody }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const { name, email, avatar } = googleAuthBodySchema.parse(request.body)

    const googleAuthenticationService = container.resolve(GoogleAuthenticationService)

    const auth = await googleAuthenticationService.execute({
      name,
      email,
      avatar: avatar || undefined,
    })

    return reply.status(201).send(auth)
  }
}
