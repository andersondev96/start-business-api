import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { IUserResponseDTO } from '../dtos/IUserResponseDTO'
import { UserMap } from '../mapper/UserMap'

import { getUserAvatarUrl } from '@shared/utils/getFilesUrl'
import type { IUpdateUserDTO } from '../dtos/IUpdateUserDTO'

interface IRequest {
  id: string
  name: string
  email: string
  password?: string
}

@injectable()
export class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ id, name, email, password }: IRequest): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new AppError('User does not exist')
    }

    if (email !== user.email) {
      const emailAlreadyUsed = await this.usersRepository.findByEmail(email)

      if (emailAlreadyUsed) {
        throw new AppError('Email address already used')
      }
    }

    const data: IUpdateUserDTO = {
      id: user.id!,
      name,
      email,
      ...(password && {
        password: await this.hashProvider.generateHash(password),
      }),
    }

    const updatedUser = await this.usersRepository.update(data)

    updatedUser.avatar = getUserAvatarUrl(updatedUser, 'avatar')

    return UserMap.toDTO(updatedUser)
  }
}
