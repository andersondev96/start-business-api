import { inject, injectable } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { UsersRepository } from '../infra/prisma/repositories/UsersRepository'
import type { IUsersRepository } from '../repositories/IUsersRepository'

@injectable()
export class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(user_id: string): Promise<void> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not exists')
    }

    await this.usersRepository.delete(user.id)
  }
}
