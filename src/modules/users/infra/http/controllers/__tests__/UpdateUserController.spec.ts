import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { UpdateUserController } from '../UpdateUserController'
import { ZodError } from 'zod'

vi.mock('@modules/users/services/UpdateUserService')

describe('UpdateUserServiceController', () => {
  let app: FastifyInstance
  let updateUserController: UpdateUserController

  const updateUserServiceMock = {
    execute: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    container.resolve = vi.fn().mockReturnValue(updateUserServiceMock)

    app = fastify()

    app.decorateRequest('user', null)
    app.addHook('onRequest', async (request) => {
      const testUserId = request.headers['x-test-user-id'] as string
      if (testUserId) {
        request.user = { id: testUserId }
      } else {
        request.user = {} as any
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

    updateUserController = new UpdateUserController()

    app.put('/users', updateUserController.handle.bind(updateUserController))

    await app.ready()
  })

  it('Should be able to update user profile (without password)', async () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    const updatePayload = {
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
    }

    const mockUserResponse = {
      id: validUuid,
      name: updatePayload.name,
      email: updatePayload.email,
      avatar: null,
      role: 'CUSTOMER',
      createdAt: new Date(),
    }

    updateUserServiceMock.execute.mockResolvedValue(mockUserResponse)

    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      headers: {
        'x-test-user-id': validUuid,
      },
      payload: updatePayload,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: validUuid,
        name: updatePayload.name,
        email: updatePayload.email,
      })
    )

    expect(updateUserServiceMock.execute).toHaveBeenCalledWith({
      id: validUuid,
      name: updatePayload.name,
      email: updatePayload.email,
      password: undefined,
    })
  })

  it('Should be able to update user profile and password', async () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    const updatePayload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'newpassword123',
    }

    updateUserServiceMock.execute.mockResolvedValue({
      id: validUuid,
      name: updatePayload.name,
      email: updatePayload.email,
    })

    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      headers: {
        'x-test-user-id': validUuid,
      },
      payload: updatePayload,
    })

    expect(response.statusCode).toBe(200)
    expect(updateUserServiceMock.execute).toHaveBeenCalledWith({
      id: validUuid,
      name: updatePayload.name,
      email: updatePayload.email,
      password: updatePayload.password,
    })
  })

  it('Should return 400 if validation fails (invalid email)', async () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    const invalidPayload = {
      name: 'John Doe',
      email: 'invalid-email-format',
    }

    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      headers: {
        'x-test-user-id': validUuid,
      },
      payload: invalidPayload,
    })

    expect(response.statusCode).toBe(400)
    expect(updateUserServiceMock.execute).not.toHaveBeenCalled()
  })

  it('Should return 400 if user ID is missing or invalid', async () => {
    const validPayload = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      payload: validPayload,
    })

    expect(response.statusCode).toBe(400)
    expect(updateUserServiceMock.execute).not.toHaveBeenCalled()
  })
})
