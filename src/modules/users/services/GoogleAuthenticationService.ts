import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import authConfig from '@config/auth'

import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IUsersTokenRepository } from '../repositories/IUsersTokenRepository'
import { GOOGLE_USER_DUMMY_PASSWORD } from '../constants/auth'

interface IRequest {
  name?: string
  email: string
  avatar?: string
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
export class GoogleAuthenticationService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokenRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ name, email, avatar }: IRequest): Promise<IResponse> {
    const user = await this.findOrCreateUser({ name, email, avatar })

    await this.processUserAvatar(avatar, user.id!)

    const { token, refreshToken } = await this.generateTokens(user.id!)

    await this.usersTokenRepository.create({
      user_id: user.id!,
      refresh_token: refreshToken,
      expires_date: this.dateProvider.addDays(authConfig.expires_refresh_token_days),
    })

    return {
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
      },
      token,
      refresh_token: refreshToken,
    }
  }

  private async findOrCreateUser({ name, email, avatar }: IRequest) {
    let user = await this.usersRepository.findByEmail(email)

    if (!user) {
      user = await this.createGoogleUser({ name: name!, email, avatar })
    }

    return user
  }

  private async createGoogleUser({ name, email, avatar }: IRequest) {
    return this.usersRepository.create({
      name: name!,
      email,
      password: await this.hashProvider.generateHash(GOOGLE_USER_DUMMY_PASSWORD),
      avatar,
      role: 'CUSTOMER',
    })
  }

  private async processUserAvatar(avatar: string | undefined, userId: string) {
    if (!avatar) return

    await this.storageProvider.save(avatar, 'avatar')
  }

  private async generateTokens(userId: string) {
    const { secret_token, expires_in_token, secret_refresh_token, expires_in_refresh_token } =
      authConfig

    const token = sign({}, secret_token, {
      subject: userId,
      expiresIn: expires_in_token,
    })

    const refreshToken = sign({ email: userId }, secret_refresh_token, {
      subject: userId,
      expiresIn: expires_in_refresh_token,
    })

    return { token, refreshToken }
  }
}
