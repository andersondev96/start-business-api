import { v4 as uuid } from 'uuid'

import { ICreateUserTokenDTO } from '@modules/users/dtos/ICreateUserTokenDTO'
import { UserToken } from '@modules/users/infra/prisma/entities/UserToken'

import { IUsersTokenRepository } from '../IUsersTokenRepository'

export class FakeUsersTokenRepository implements IUsersTokenRepository {
  private userToken: UserToken[] = []

  public async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const token = {
      id: uuid(),
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.userToken.push(token)

    return token
  }

  public async findByUserAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken | null> {
    const token = this.userToken.find(
      (item) => item.user_id === user_id && item.refresh_token === refresh_token,
    )

    return token ?? null
  }

  public async findByRefreshToken(refresh_token: string): Promise<UserToken | null> {
    const token = this.userToken.find((ut) => ut.refresh_token === refresh_token)
    return token ?? null
  }

  public async deleteById(id: string): Promise<void> {
    const index = this.userToken.findIndex((item) => item.id === id)

    if (index !== -1) {
      this.userToken.splice(index, 1)
    }
  }
}
