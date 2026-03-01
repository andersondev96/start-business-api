import { inject, injectable } from 'tsyringe'
import { AppError } from '@shared/errors/AppError'
import { IUserResponseDTO } from '../dtos/IUserResponseDTO'
import { UserMap } from '../mapper/UserMap'
import { IUsersRepository } from '../repositories/IUsersRepository'

@injectable()
export class FindUserByEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(email: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findByMail(email)

    if (!user) {
      throw new AppError('User does not exists')
    }

    return UserMap.toDTO(user)
  }
}
