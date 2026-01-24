import { ICreateUserDTO } from '../dtos/ICreateUserDTO'
import { IUpdateUserDTO } from '../dtos/IUpdateUserDTO'
import { User } from '../infra/prisma/entities/User'

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>
  findById(id: string): Promise<User | null>
  findByMail(email: string): Promise<User | null>
  addFavorite(userId: string, favorite: string): Promise<User>
  update(user: IUpdateUserDTO): Promise<User>
  delete(id: string): Promise<void>
}
