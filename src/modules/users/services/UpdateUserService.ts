import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { IUserResponseDTO } from '../dtos/IUserResponseDTO'
import { UserMap } from '../mapper/UserMap'

import { getUserAvatarUrl } from '@shared/utils/getFilesUrl'

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
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    id,
    name,
    email,
    password,
  }: IRequest): Promise<IUserResponseDTO> {
    const userExists = await this.userRepository.findById(id)

    if (!userExists) {
      throw new AppError('User does not exist')
    }

    if (email !== userExists.email) {
      const emailExists = await this.userRepository.findByMail(email)

      if (emailExists && emailExists.id !== id) {
        throw new AppError('Email address already used')
      }
    }

    const updateData = {
      id,
      name,
      email,
      password: userExists.password,
    }

    if (password) {
      updateData.password = await this.hashProvider.generateHash(password)
    }

    const updateUser = await this.userRepository.update(updateData)

    updateUser.avatar = getUserAvatarUrl(updateUser, 'avatar')

    return UserMap.toDTO(updateUser)
  }
}
