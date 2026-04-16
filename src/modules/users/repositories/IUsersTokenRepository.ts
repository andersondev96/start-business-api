import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO'
import { UserToken } from '../infra/prisma/entities/UserToken'

export interface IUsersTokenRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>

  findByUserAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken | null>

  findByRefreshToken(refresh_token: string): Promise<UserToken | null>

  deleteById(id: string): Promise<void>
}
