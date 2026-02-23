import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'
import { CreateUserService } from '@modules/users/services/CreateUserService'

const createUserBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 chars'),
  role: z.enum(['ADMIN', 'ENTREPRENEUR', 'CUSTOMER']).default('CUSTOMER'),
})

export class CreateUsersController {
  async handle(
    request: FastifyRequest,
    response: FastifyReply
  ): Promise<FastifyReply> {
    const { name, email, password, role } = createUserBodySchema.parse(
      request.body
    )

    const createUserService = container.resolve(CreateUserService)

    const user = await createUserService.execute({
      name,
      email,
      password,
      role,
    })

    return response.status(201).send(user)
  }
}
