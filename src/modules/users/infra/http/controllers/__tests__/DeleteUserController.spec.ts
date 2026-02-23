import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { ZodError } from 'zod'

import { DeleteUserController } from '../DeleteUserController'

vi.mock('@modules/users/services/DeleteUserService')

describe('DeleteUserController', () => {
  let app: FastifyInstance
  let deleteUserController: DeleteUserController

  const deleteUserServiceMock = {
    execute: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    container.resolve = vi.fn().mockReturnValue(deleteUserServiceMock)

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

    deleteUserController = new DeleteUserController()

    app.delete('/users', deleteUserController.handle.bind(deleteUserController))

    await app.ready()
  })

  it('Should be able to delete a user', async () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'

    deleteUserServiceMock.execute.mockResolvedValue(undefined)

    const response = await app.inject({
      method: 'DELETE',
      url: '/users',
      headers: {
        'x-test-user-id': validUuid,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(deleteUserServiceMock.execute).toHaveBeenCalledWith(validUuid)
  })

  it('Should return 400 if user ID is not a valid UUID', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/users',
      headers: {
        'x-test-user-id': 'invalid-uuid-format',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(deleteUserServiceMock.execute).not.toHaveBeenCalled()
  })
})
