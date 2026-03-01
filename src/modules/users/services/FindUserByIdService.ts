import { inject, injectable } from 'tsyringe'
import { AppError } from '@shared/errors/AppError'
import { IUserResponseDTO } from '../dtos/IUserResponseDTO'
import { UserMap } from '../mapper/UserMap'
import { IUsersRepository } from '../repositories/IUsersRepository'

@injectable()
export class FindUserByIdService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(user_id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not exists')
    }

    return UserMap.toDTO(user)
  }
}
