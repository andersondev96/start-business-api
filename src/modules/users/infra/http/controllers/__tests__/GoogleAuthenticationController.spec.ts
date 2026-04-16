import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { ZodError } from 'zod'

import { GoogleAuthenticationController } from '../GoogleAuthenticationController'
import { GoogleAuthenticationService } from '@modules/users/services/GoogleAuthenticationService'
import { AppError } from '@shared/errors/AppError'

vi.mock('@modules/users/services/GoogleAuthenticationService')

const makeGoogleAuthBody = () => ({
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  avatar: 'https://lh3.googleusercontent.com/a-/ABCDEF',
})

describe('GoogleAuthenticationController Integration', () => {
  let app: FastifyInstance
  let googleAuthenticationController: GoogleAuthenticationController

  const googleAuthenticationServiceMock = {
    execute: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    container.resolve = vi.fn().mockReturnValue(googleAuthenticationServiceMock)

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

    googleAuthenticationController = new GoogleAuthenticationController()

    app.post(
      '/google-auth',
      googleAuthenticationController.handle.bind(googleAuthenticationController),
    )

    await app.ready()
  })

  describe('POST /google-auth', () => {
    it('should create user and return auth data with valid google credentials', async () => {
      const mockAuthResponse = {
        user: { id: 'user-123', name: 'John Doe', email: 'john.doe@gmail.com' },
        token: 'jwt-token-abc123',
      }

      vi.spyOn(container, 'resolve').mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockAuthResponse),
      } as unknown as GoogleAuthenticationService)

      const response = await app
        .inject()
        .post('/google-auth')
        .payload(JSON.stringify(makeGoogleAuthBody()))
        .headers({ 'Content-Type': 'application/json' })

      expect(response.statusCode).toBe(201)
      expect(JSON.parse(response.payload)).toEqual(mockAuthResponse)
    })
  })

  it('should return 400 when name is missing', async () => {
    const invalidBody = {
      email: 'john.doe@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a-/ABCDEF',
    }

    const response = await app
      .inject()
      .post('/google-auth')
      .payload(JSON.stringify(invalidBody))
      .headers({ 'Content-Type': 'application/json' })

    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.payload)
    expect(body).toHaveProperty('status', 'error')
    expect(body).toHaveProperty('message', 'Validation error')
    expect(body.issues.name._errors).toContain('Name is required')
  })

  it('should return 400 when email is invalid', async () => {
    const invalidBody = {
      name: 'John Doe',
      email: 'invalid-email',
      avatar: 'https://lh3.googleusercontent.com/a-/ABCDEF',
    }

    const response = await app
      .inject()
      .post('/google-auth')
      .payload(JSON.stringify(invalidBody))
      .headers({ 'Content-Type': 'application/json' })

    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.payload)
    expect(body.issues.email._errors).toContain('Invalid email format')
  })
})
