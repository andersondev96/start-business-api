import { inject, injectable } from 'tsyringe'

import authConfig from '@config/auth'
import { AppError } from '@shared/errors/AppError'
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider'
import { FileUrlBuilder } from '@shared/utils/fileUrlBuilder'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IUsersTokenRepository } from '../repositories/IUsersTokenRepository'
import type { ITokenProvider } from '@shared/container/providers/TokenProvider/models/ITokenProvider'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: {
    name: string
    email: string
    avatar: string | null
  }
  token: string
  refresh_token: string
}

@injectable()
export class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider
  ) {}
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByMail(email)

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401)
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    )

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401)
    }

    const token = this.tokenProvider.generateAccessToken(user.id!)
    const refresh_token = this.tokenProvider.generateRefreshToken(
      user.id!,
      email
    )

    const refresh_token_expires_date = this.dateProvider.addDays(
      authConfig.expires_refresh_token_days
    )

    await this.usersTokenRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    })

    return {
      token,
      user: {
        name: user.name,
        email: user.email,
        avatar: FileUrlBuilder.build(user.avatar, 'avatar'),
      },
      refresh_token,
    }
  }
}
