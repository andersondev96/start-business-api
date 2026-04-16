import { vi } from 'vitest'
import { sign } from 'jsonwebtoken'

import authConfig from '@config/auth'

import { GoogleAuthenticationService } from '../GoogleAuthenticationService'
import { FakeUsersRepository } from '@modules/users/repositories/Fakes/FakeUsersRepository'
import { FakeUsersTokenRepository } from '@modules/users/repositories/Fakes/FakeUsersTokenRepository'
import { FakeHashProvider } from '@modules/users/providers/HashProvider/Fakes/FakeHashProvider'
import { FakeDateProvider } from '@shared/container/providers/DateProvider/Fakes/FakeDateProvider'
import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakerStorageProvider'
import { GOOGLE_USER_DUMMY_PASSWORD } from '@modules/users/constants/auth'

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
}))

describe('GoogleAuthenticationService', () => {
  let googleAuthenticationService: GoogleAuthenticationService

  let fakeUsersRepository: FakeUsersRepository
  let fakeUsersTokenRepository: FakeUsersTokenRepository
  let fakeHashProvider: FakeHashProvider
  let fakeDateProvider: FakeDateProvider
  let fakeStorageProvider: FakeStorageProvider

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUsersTokenRepository = new FakeUsersTokenRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeDateProvider = new FakeDateProvider()
    fakeStorageProvider = new FakeStorageProvider()

    googleAuthenticationService = new GoogleAuthenticationService(
      fakeUsersRepository,
      fakeUsersTokenRepository,
      fakeHashProvider,
      fakeDateProvider,
      fakeStorageProvider,
    )
    ;(sign as any)
      .mockReset()
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token')
  })

  it('should must authenticate an existing user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Anderson Fernandes',
      email: 'anderson@email.com',
      password: 'hashed-password',
      avatar: 'avatar.png',
      role: 'CUSTOMER',
    })

    const createTokenSpy = vi.spyOn(fakeUsersTokenRepository, 'create')
    const saveAvatarSpy = vi.spyOn(fakeStorageProvider, 'save')

    const response = await googleAuthenticationService.execute({
      email: 'anderson@email.com',
      avatar: 'avatar.png',
    })

    expect(response).toEqual({
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
      },
      token: 'access-token',
      refresh_token: 'refresh-token',
    })

    const persistedToken = await fakeUsersTokenRepository.findByRefreshToken('refresh-token')

    expect(persistedToken).toBeDefined()
    expect(persistedToken.user_id).toBe(user.id)
  })

  it('should create a new user when they do not exist', async () => {
    const generateHashSpy = vi.spyOn(fakeHashProvider, 'generateHash')
    const createUserSpy = vi.spyOn(fakeUsersRepository, 'create')
    const saveAvatarSpy = vi.spyOn(fakeStorageProvider, 'save')

    const response = await googleAuthenticationService.execute({
      name: 'Anderson Fernandes',
      email: 'anderson@email.com',
      avatar: 'avatar.png',
    })

    expect(generateHashSpy).toHaveBeenCalledWith(GOOGLE_USER_DUMMY_PASSWORD)

    expect(createUserSpy).toHaveBeenCalledWith({
      name: 'Anderson Fernandes',
      email: 'anderson@email.com',
      password: expect.any(String),
      avatar: 'avatar.png',
      role: 'CUSTOMER',
    })

    const createdUser = await fakeUsersRepository.findByEmail('anderson@email.com')

    expect(createdUser).not.toBeNull()
    expect(createdUser?.email).toBe('anderson@email.com')
    expect(createdUser?.name).toBe('Anderson Fernandes')
    expect(createdUser?.role).toBe('CUSTOMER')

    expect(saveAvatarSpy).toHaveBeenCalledWith('avatar.png', 'avatar')

    expect(response).toEqual({
      user: {
        name: 'Anderson Fernandes',
        email: 'anderson@email.com',
        avatar: 'avatar.png',
      },
      token: 'access-token',
      refresh_token: 'refresh-token',
    })
  })

  it('should not save avatar when avatar is not provided', async () => {
    await fakeUsersRepository.create({
      name: 'Anderson Fernandes',
      email: 'anderson@email.com',
      password: 'hashed-password',
      avatar: null,
      role: 'CUSTOMER',
    })

    const saveAvatarSpy = vi.spyOn(fakeStorageProvider, 'save')

    const response = await googleAuthenticationService.execute({
      email: 'anderson@email.com',
    })

    expect(saveAvatarSpy).not.toHaveBeenCalled()

    expect(response).toEqual({
      user: {
        name: 'Anderson Fernandes',
        email: 'anderson@email.com',
        avatar: null,
      },
      token: 'access-token',
      refresh_token: 'refresh-token',
    })
  })

  it('should generate access token and refresh token with the correct parameters', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Anderson Fernandes',
      email: 'anderson@email.com',
      password: 'hashed-password',
      avatar: null,
      role: 'CUSTOMER',
    })

    await googleAuthenticationService.execute({
      email: 'anderson@email.com',
    })

    expect(sign).toHaveBeenNthCalledWith(1, {}, authConfig.secret_token, {
      subject: user.id,
      expiresIn: authConfig.expires_in_token,
    })

    expect(sign).toHaveBeenNthCalledWith(2, { email: user.id }, authConfig.secret_refresh_token, {
      subject: user.id,
      expiresIn: authConfig.expires_in_refresh_token,
    })
  })

  it('should persist the refresh token with the correct expiration date', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Anderson Fernandes',
      email: 'anderson@email.com',
      password: 'hashed-password',
      avatar: null,
      role: 'CUSTOMER',
    })

    const addDaysSpy = vi.spyOn(fakeDateProvider, 'addDays')

    await googleAuthenticationService.execute({
      email: 'anderson@email.com',
    })

    expect(addDaysSpy).toHaveBeenCalledWith(authConfig.expires_refresh_token_days)

    const savedToken = await fakeUsersTokenRepository.findByRefreshToken('refresh-token')

    expect(savedToken).toBeDefined()
    expect(savedToken.user_id).toBe(user.id)
    expect(savedToken.refresh_token).toBe('refresh-token')
  })
})
