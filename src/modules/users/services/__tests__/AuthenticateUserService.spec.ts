import { describe, it, expect, beforeEach } from 'vitest'
import { AppError } from '@shared/errors/AppError'

import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { FakeUsersTokenRepository } from '../../repositories/Fakes/FakeUsersTokenRepository'
import { FakeHashProvider } from '../../providers/HashProvider/Fakes/FakeHashProvider'
import { FakeDateProvider } from '../../../../shared/container/providers/DateProvider/Fakes/FakeDateProvider'
import { FakeTokenProvider } from '@shared/container/providers/TokenProvider/fakes/FakeTokenProvider'

import { AuthenticateUserService } from '../AuthenticateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeUsersTokenRepository: FakeUsersTokenRepository
let fakeHashProvider: FakeHashProvider
let fakeDateProvider: FakeDateProvider
let fakeTokenProvider: FakeTokenProvider
let authenticateUserService: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUsersTokenRepository = new FakeUsersTokenRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeDateProvider = new FakeDateProvider()
    fakeTokenProvider = new FakeTokenProvider()

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeUsersTokenRepository,
      fakeHashProvider,
      fakeDateProvider,
      fakeTokenProvider
    )
  })

  it('should be able authenticate a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const response = await authenticateUserService.execute({
      email: user.email,
      password: user.password,
    })

    expect(response).toHaveProperty('token')
    expect(response).toHaveProperty('refresh_token')
    expect(response.user.email).toBe(user.email)

    const userToken = await fakeUsersTokenRepository.findByRefreshToken(
      response.refresh_token
    )

    expect(userToken).toBeTruthy()
    expect(userToken?.user_id).toBe(user.id)
  })

  it('should not be able to authenticate with non-existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'joh.doe@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able authenticate with incorrect password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    await expect(
      authenticateUserService.execute({
        email: user.email,
        password: 'wrong-password',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
