import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { ZodError } from 'zod'

import { AuthenticateUserController } from '../AuthenticateUserController'
import { AppError } from '@shared/errors/AppError'

vi.mock('@modules/users/services/AuthenticateUserService')

describe('AuthenticateUserController', () => {
  let app: FastifyInstance
  let authenticateUserController: AuthenticateUserController

  const authenticateUserServiceMock = {
    execute: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    container.resolve = vi.fn().mockReturnValue(authenticateUserServiceMock)

    app = fastify()

    app.setErrorHandler((error, _, reply) => {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          status: 'error',
          message: 'Validation error',
          issues: error.format(),
        })
      }

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        })
      }

      return reply.status(500).send({ message: 'Internal Server Error' })
    })

    authenticateUserController = new AuthenticateUserController()

    app.post(
      '/sessions',
      authenticateUserController.handle.bind(authenticateUserController)
    )

    await app.ready()
  })

  it('should be able to authenticate a user', async () => {
    const serviceResponse = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
      },
      token: 'fake-jwt-token',
      refresh_token: 'fake-refresh-token',
    }

    authenticateUserServiceMock.execute.mockResolvedValue(serviceResponse)

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'john@example.com',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(serviceResponse)

    expect(authenticateUserServiceMock.execute).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password123',
    })
  })

  it('should return 400 if validation fails (invalid email)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'invalid-email',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(authenticateUserServiceMock.execute).not.toHaveBeenCalled()
  })

  it('should return 400 if password is too short', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'john@example.com',
        password: '123',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(authenticateUserServiceMock.execute).not.toHaveBeenCalled()
  })

  it('should return 401 if credentials are incorrect', async () => {
    authenticateUserServiceMock.execute.mockRejectedValue(
      new AppError('Incorrect email/password combination', 401)
    )

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'john@example.com',
        password: 'wrong-password',
      },
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({
      status: 'error',
      message: 'Incorrect email/password combination',
    })
  })
})
