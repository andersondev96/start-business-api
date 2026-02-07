import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'
import { AuthenticateUserService } from '@modules/users/services/AuthenticateUserService'

const authenticateUserParamsSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Email is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

export class AuthenticateUserController {
  async handle(
    request: FastifyRequest,
    response: FastifyReply
  ): Promise<FastifyReply> {
    const { email, password } = authenticateUserParamsSchema.parse(request.body)

    const authenticateUserService = container.resolve(AuthenticateUserService)

    const user = await authenticateUserService.execute({
      email,
      password,
    })

    return response.status(200).send(user)
  }
}
