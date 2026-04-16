import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { ZodError } from 'zod'

import { UpdateUserController } from '../UpdateUserController'

vi.mock('@modules/users/services/UpdateUserService')

declare module 'fastify' {
  interface FastifyRequest {
    userHolder?: {
      id: string
    }
  }
}

describe('UpdateUserController', () => {
  let app: FastifyInstance
  let controller: UpdateUserController

  const validUserId = '123e4567-e89b-12d3-a456-426614174000'

  const updateUserServiceMock = {
    execute: vi.fn(),
  }

  const makePayload = (
    overrides?: Partial<{
      name: string
      email: string
      password?: string
    }>,
  ) => ({
    name: 'John Doe',
    email: 'john@example.com',
    ...overrides,
  })

  beforeEach(async () => {
    vi.clearAllMocks()

    vi.spyOn(container, 'resolve').mockReturnValue(updateUserServiceMock as never)

    controller = new UpdateUserController()
    app = fastify()

    app.decorateRequest('userHolder')
    app.decorateRequest('user', {
      getter() {
        if (!this.userHolder) {
          this.userHolder = { id: '' }
        }

        return this.userHolder
      },
      setter(value: { id: string }) {
        this.userHolder = value
      },
    })

    app.addHook('onRequest', async (request) => {
      const testUserId = request.headers['x-test-user-id'] as string | undefined

      request.user = {
        id: testUserId ?? '',
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

      return reply.status(500).send({
        status: 'error',
        message: 'Internal server error',
      })
    })

    app.put('/users', controller.handle.bind(controller))

    await app.ready()
  })

  it('should update user profile without password', async () => {
    const payload = makePayload({
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
    })

    updateUserServiceMock.execute.mockResolvedValue({
      id: validUserId,
      name: payload.name,
      email: payload.email,
      avatar: null,
      role: 'CUSTOMER',
      createdAt: new Date(),
    })

    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      headers: {
        'x-test-user-id': validUserId,
      },
      payload,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: validUserId,
        name: payload.name,
        email: payload.email,
      }),
    )

    expect(updateUserServiceMock.execute).toHaveBeenCalledWith({
      id: validUserId,
      name: payload.name,
      email: payload.email,
      password: undefined,
    })
  })

  it('should update user profile with password', async () => {
    const payload = makePayload({
      password: 'newpassword123',
    })

    updateUserServiceMock.execute.mockResolvedValue({
      id: validUserId,
      name: payload.name,
      email: payload.email,
    })

    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      headers: {
        'x-test-user-id': validUserId,
      },
      payload,
    })

    expect(response.statusCode).toBe(200)
    expect(updateUserServiceMock.execute).toHaveBeenCalledWith({
      id: validUserId,
      name: payload.name,
      email: payload.email,
      password: payload.password,
    })
  })

  it('should return 400 when email is invalid', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      headers: {
        'x-test-user-id': validUserId,
      },
      payload: makePayload({
        email: 'invalid-email-format',
      }),
    })

    expect(response.statusCode).toBe(400)
    expect(updateUserServiceMock.execute).not.toHaveBeenCalled()
  })

  it('should return 400 when authenticated user id is missing', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      payload: makePayload(),
    })

    expect(response.statusCode).toBe(400)
    expect(updateUserServiceMock.execute).not.toHaveBeenCalled()
  })

  it('should return 400 when password is shorter than 8 chars', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/users',
      headers: {
        'x-test-user-id': validUserId,
      },
      payload: makePayload({
        password: '123',
      }),
    })

    expect(response.statusCode).toBe(400)
    expect(updateUserServiceMock.execute).not.toHaveBeenCalled()
  })
})
