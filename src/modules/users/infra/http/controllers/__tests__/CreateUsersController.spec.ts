import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { CreateUsersController } from '../CreateUsersController'
import { ZodError } from 'zod'

vi.mock('@modules/users/services/CreateUserService')

describe('CreateUsersController', () => {
  let app: FastifyInstance
  let createUsersController: CreateUsersController

  const createUserServiceMock = {
    execute: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    container.resolve = vi.fn().mockReturnValue(createUserServiceMock)

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

    createUsersController = new CreateUsersController()

    app.post('/users', createUsersController.handle.bind(createUsersController))

    await app.ready()
  })

  it('should be able to create a new user via HTTP request', async () => {
    const userMock = {
      id: 'any-id',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
      favorites: [],
      createdAt: new Date(),
    }

    createUserServiceMock.execute.mockResolvedValue(userMock)

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isEntrepreneur: false,
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: 'any-id',
        email: 'john@example.com',
      })
    )

    expect(createUserServiceMock.execute).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      isEntrepreneur: false,
    })
  })

  it('should return 400 if validation fails (invalid email)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John Doe',
        email: 'invalid-email-format',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(createUserServiceMock.execute).not.toHaveBeenCalled()
  })

  it('should return 400 if password is too short', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should pass "isEntrepreneur" default value as false if not provided', async () => {
    createUserServiceMock.execute.mockResolvedValue({})

    await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    })

    expect(createUserServiceMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        isEntrepreneur: false,
      })
    )
  })
})
