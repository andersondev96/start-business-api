import { FakeMailProvider } from '@shared/container/providers/MailProvider/Fakes/FakeMailProvider'
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider'
import { AppError } from '@shared/errors/AppError'

import { FakeDateProvider } from '../../../../shared/container/providers/DateProvider/Fakes/FakeDateProvider'
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/models/IDateProvider'
import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { FakeUsersTokenRepository } from '../../repositories/Fakes/FakeUsersTokenRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { IUsersTokenRepository } from '../../repositories/IUsersTokenRepository'
import { SendForgotPasswordMailService } from '../SendForgotPasswordMailService'

let fakeUsersRepository: IUsersRepository
let fakeUsersTokenRepository: IUsersTokenRepository
let fakeDateProvider: IDateProvider
let fakeMailProvider: IMailProvider
let sendForgotPasswordMailService: SendForgotPasswordMailService

describe('Send Forgot Password Mail Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUsersTokenRepository = new FakeUsersTokenRepository()
    fakeDateProvider = new FakeDateProvider()
    fakeMailProvider = new FakeMailProvider()

    sendForgotPasswordMailService = new SendForgotPasswordMailService(
      fakeUsersRepository,
      fakeUsersTokenRepository,
      fakeDateProvider,
      fakeMailProvider
    )
  })

  it('Should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    const user = await fakeUsersRepository.create({
      name: 'John doe',
      email: 'john@example.com',
      password: '123456',
    })

    await sendForgotPasswordMailService.execute(user.email)

    expect(sendMail).toHaveBeenCalled()
  })

  it('Should be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailService.execute('noexists@example.com')
    ).rejects.toEqual(new AppError('User does not exists!'))
  })

  it('Should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(fakeUsersTokenRepository, 'create')

    const user = await fakeUsersRepository.create({
      name: 'John doe',
      email: 'john@example.com',
      password: '123456',
    })

    await sendForgotPasswordMailService.execute(user.email)

    expect(generateTokenMail).toBeCalled()
  })
})
