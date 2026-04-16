import { resolve } from 'path'
import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { AppError } from '@shared/errors/AppError'

import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider'
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IUsersTokenRepository } from '../repositories/IUsersTokenRepository'

@injectable()
export class SendForgotPasswordMailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string) {
    const user = await this.usersRepository.findByEmail(email)

    const templatePath = resolve(__dirname, '..', 'views', 'emails', 'forgotPassword.hbs')

    if (!user) {
      throw new AppError('User does not exists!')
    }

    const token = uuidV4()

    const expires_date = this.dateProvider.addHours(3)

    await this.usersTokenRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    })

    const variables = {
      name: user.name,
      link:
        process.env.APP_ENV === 'production'
          ? `${process.env.APP_WEB_URL}/reset-password?token=${token}`
          : `${process.env.APP_WEB_URL_PROD}/reset-password?token=${token}`,
    }

    await this.mailProvider.sendMail(email, 'Recuperação de senha', variables, templatePath)
  }
}
