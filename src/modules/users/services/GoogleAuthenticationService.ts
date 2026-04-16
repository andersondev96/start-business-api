import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import authConfig from '@config/auth'

import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IUsersTokenRepository } from '../repositories/IUsersTokenRepository'

interface IRequest {
  name?: string
  email: string
  avatar?: string
}

interface IResponse {
  user: {
    name: string
    email: string
    avatar: string
  }
  token: string
  refresh_token: string
}

@injectable()
export class GoogleAuthenticationService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
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
    let user = await this.userRepository.findByEmail(email)

    if (!user) {
      const hashPassword = await this.hashProvider.generateHash('zI3D~*2Y')
      user = await this.userRepository.create({
        name,
        email,
        password: hashPassword,
        avatar,
      })

      if (avatar) {
        await this.storageProvider.save(avatar, 'avatar')
      }
    }

    if (user) {
      const {
        secret_token,
        expires_in_token,
        secret_refresh_token,
        expires_in_refresh_token,
        expires_refresh_token_days,
      } = authConfig

      const token = sign({}, secret_token, {
        subject: user.id,
        expiresIn: expires_in_token,
      })

      const refresh_token = sign({ email }, secret_refresh_token, {
        subject: user.id,
        expiresIn: expires_in_refresh_token,
      })

      const refresh_token_expires_date = this.dateProvider.addDays(expires_refresh_token_days)

      await this.usersTokenRepository.create({
        user_id: user.id,
        refresh_token,
        expires_date: refresh_token_expires_date,
      })

      const tokenReturn: IResponse = {
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        refresh_token,
      }

      return tokenReturn
    }
  }
}
