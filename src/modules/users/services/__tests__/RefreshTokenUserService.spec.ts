import { AppError } from '@shared/errors/AppError'

import { FakeDateProvider } from '../../../../shared/container/providers/DateProvider/Fakes/FakeDateProvider'
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/models/IDateProvider'
import { FakeHashProvider } from '../../providers/HashProvider/Fakes/FakeHashProvider'
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider'
import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { FakeUsersTokenRepository } from '../../repositories/Fakes/FakeUsersTokenRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { IUsersTokenRepository } from '../../repositories/IUsersTokenRepository'
import { AuthenticateUserService } from '../AuthenticateUserService'
import { RefreshTokenUserService } from '../RefreshTokenUserService'

let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider
let fakeDateProvider: IDateProvider
let fakeUsersTokenRepository: IUsersTokenRepository
let refreshTokenUserService: RefreshTokenUserService
let authenticateUserService: AuthenticateUserService

describe('RefreshTokenUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUsersTokenRepository = new FakeUsersTokenRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeDateProvider = new FakeDateProvider()

    refreshTokenUserService = new RefreshTokenUserService(
      fakeUsersTokenRepository,
      fakeDateProvider
    )

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeUsersTokenRepository,
      fakeHashProvider,
      fakeDateProvider
    )
  })

  it('should be able generate a new token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const authentication = await authenticateUserService.execute({
      email: user.email,
      password: user.password,
    })

    const response = await refreshTokenUserService.execute(
      authentication.refresh_token
    )

    expect(response).toHaveProperty('refresh_token')
  })

  it('should be able to user token is invalid', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const authentication = await authenticateUserService.execute({
      email: user.email,
      password: user.password,
    })

    const refresh_token =
      await fakeUsersTokenRepository.findByUserAndRefreshToken(
        user.id,
        authentication.refresh_token
      )

    await fakeUsersTokenRepository.deleteById(refresh_token.id)

    await expect(
      refreshTokenUserService.execute(authentication.refresh_token)
    ).rejects.toBeInstanceOf(AppError)
  })
})
