import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { ZodError } from 'zod'

import { FindUserByEmailController } from '../FindUserByEmailController'

vi.mock('@modules/users/services/FindUserByEmailService')

describe('FindUserByEmailController', () => {
  let app: FastifyInstance
  let findUserByEmailController: FindUserByEmailController

  const findUserByEmailServiceMock = {
    execute: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    container.resolve = vi.fn().mockReturnValue(findUserByEmailServiceMock)

    app = fastify()

    app.setErrorHandler((error, _, reply) => {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          status: 'error',
          message: 'Validation error',
          issues: error.format(),
        })
      }

      return reply.status(500).send(error)
    })

    findUserByEmailController = new FindUserByEmailController()

    app.get(
      '/users',
      findUserByEmailController.handle.bind(findUserByEmailController)
    )

    await app.ready()
  })

  it('Should be able to get a user by email', async () => {
    const targetEmail = 'john@example.com'

    const mockUserResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: targetEmail,
    }

    findUserByEmailServiceMock.execute.mockResolvedValue(mockUserResponse)

    const response = await app.inject({
      method: 'GET',
      url: '/users',
      query: {
        email: targetEmail,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(mockUserResponse)
    expect(findUserByEmailServiceMock.execute).toHaveBeenCalledWith(targetEmail)
  })

  it('Should return 400 if email format is invalid', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        email: 'invalid-email-format',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(findUserByEmailServiceMock.execute).not.toHaveBeenCalled()
  })
})
