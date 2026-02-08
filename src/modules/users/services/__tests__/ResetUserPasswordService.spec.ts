import { v4 as uuidV4 } from 'uuid'

import { AppError } from '@shared/errors/AppError'

import { FakeDateProvider } from '../../../../shared/container/providers/DateProvider/Fakes/FakeDateProvider'
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/models/IDateProvider'
import { FakeHashProvider } from '../../providers/HashProvider/Fakes/FakeHashProvider'
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider'
import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { FakeUsersTokenRepository } from '../../repositories/Fakes/FakeUsersTokenRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { IUsersTokenRepository } from '../../repositories/IUsersTokenRepository'
import { ResetUserPasswordService } from '../ResetUserPasswordService'

let fakeHashProvider: IHashProvider
let fakeDateProvider: IDateProvider
let fakeUsersRepository: IUsersRepository
let fakeUsersTokenRepository: IUsersTokenRepository
let resetUserPasswordService: ResetUserPasswordService

describe('ResetUserPasswordService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider()
    fakeDateProvider = new FakeDateProvider()
    fakeUsersRepository = new FakeUsersRepository()
    fakeUsersTokenRepository = new FakeUsersTokenRepository()

    resetUserPasswordService = new ResetUserPasswordService(
      fakeUsersTokenRepository,
      fakeUsersRepository,
      fakeDateProvider,
      fakeHashProvider
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const token = uuidV4()

    const expires_date = fakeDateProvider.addHours(3)

    const userToken = await fakeUsersTokenRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    })

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetUserPasswordService.execute({
      token: userToken.refresh_token,
      password: '123123',
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('123123')
    expect(updatedUser?.password).toBe('123123')
  })

  it('should be able to reset password with non-existing token', async () => {
    expect(
      resetUserPasswordService.execute({
        token: '123456',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to reset password with non-existing user', async () => {
    const token = 'uuidV4()'

    await expect(
      resetUserPasswordService.execute({
        token,
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to reset password if passed more than two hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const token = uuidV4()

    const expires_date = fakeDateProvider.addHours(3)

    await fakeUsersTokenRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetUserPasswordService.execute({
        password: '123123',
        token,
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
