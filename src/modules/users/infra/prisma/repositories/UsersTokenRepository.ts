import { prisma } from '@database/prisma'
import { ICreateUserTokenDTO } from '@modules/users/dtos/ICreateUserTokenDTO'
import { IUsersTokenRepository } from '@modules/users/repositories/IUsersTokenRepository'

import { UserToken } from '../entities/UserToken'

export class UsersTokenRepository implements IUsersTokenRepository {
  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const token = await prisma.userToken.create({
      data: { expires_date, refresh_token, user_id },
    })

    return token
  }

  async findByUserAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken> {
    const usersToken = await prisma.userToken.findFirst({
      where: {
        user_id,
        refresh_token,
      },
    })

    return usersToken
  }

  async deleteById(id: string): Promise<void> {
    await prisma.userToken.delete({
      where: {
        id,
      },
    })
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    const userToken = await prisma.userToken.findFirst({
      where: { refresh_token },
    })

    return userToken
  }
}
