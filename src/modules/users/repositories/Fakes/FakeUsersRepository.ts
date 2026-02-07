import { v4 as uuid } from 'uuid'
import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO'
import { IUpdateUserDTO } from '@modules/users/dtos/IUpdateUserDTO'
import { User } from '@modules/users/infra/prisma/entities/User'
import { IUsersRepository } from '../IUsersRepository'

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findById(id: string): Promise<User | null> {
    const findUserById = this.users.find((user) => user.id === id)
    return findUserById || null
  }

  public async findByMail(email: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.email === email)
    return findUser || null
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user: User = {
      ...data,
      id: uuid(),
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: data.avatar ?? null,
    } as User

    this.users.push(user)
    return user
  }

  public async update(data: IUpdateUserDTO): Promise<User> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === data.id
    )

    const user = this.users[findIndex]

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    }

    this.users[findIndex] = updatedUser

    return updatedUser
  }

  public async addFavorite(user_id: string, favorite: string): Promise<User> {
    const findIndex = this.users.findIndex((user) => user.id === user_id)
    const user = this.users[findIndex]

    if (!user) {
      throw new Error(`User with id ${user_id} not found`)
    }

    const updatedUser = {
      ...user,
      favorites: [...(user.favorites || []), favorite],
    }

    this.users[findIndex] = updatedUser

    return updatedUser
  }

  public async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id)

    if (index !== -1) {
      this.users.splice(index, 1)
    }
  }
}
