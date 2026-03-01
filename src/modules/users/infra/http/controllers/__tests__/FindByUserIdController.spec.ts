import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { ZodError } from 'zod'

import { FindUserByIdController } from '../FindUserByIdController'

vi.mock('@modules/users/services/FindUserByIdService')

describe('FindUserByIdController', () => {
  let app: FastifyInstance
  let findUserByIdController: FindUserByIdController

  const findUserByIdServiceMock = {
    execute: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    container.resolve = vi.fn().mockReturnValue(findUserByIdServiceMock)

    app = fastify()

    app.decorateRequest('user', null)
    app.addHook('onRequest', async (request) => {
      const testUserId = request.headers['x-test-user-id'] as string
      if (testUserId) {
        request.user = { id: testUserId }
      }
    })

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

    findUserByIdController = new FindUserByIdController()

    app.get(
      '/users',
      findUserByIdController.handle.bind(findUserByIdController)
    )

    await app.ready()
  })

  it('Should be able to get a user by ID', async () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'

    const mockUserResponse = {
      id: validUuid,
      name: 'John Doe',
      email: 'john@example.com',
    }

    findUserByIdServiceMock.execute.mockResolvedValue(mockUserResponse)

    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        'x-test-user-id': validUuid,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(mockUserResponse)
    expect(findUserByIdServiceMock.execute).toHaveBeenCalledWith(validUuid)
  })

  it('Should return 400 if user ID is not a valid UUID', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        'x-test-user-id': 'invalid-uuid-format',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(findUserByIdServiceMock.execute).not.toHaveBeenCalled()
  })
})
