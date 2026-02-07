import { PrismaClient } from '@prisma/client'
import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO'
import { IUpdateUserDTO } from '@modules/users/dtos/IUpdateUserDTO'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { User } from '../entities/User'
import { UserMap } from '@modules/users/mapper/UserMap'

export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async create(data: ICreateUserDTO): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: data.avatar ?? null,
      },
    })
  }

  async findByMail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  public async addFavorite(userId: string, favorite: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          push: favorite,
        },
      },
    })

    return UserMap.toDomain(user)
  }

  async update(data: IUpdateUserDTO): Promise<User> {
    const { id, ...fields } = data

    return this.prisma.user.update({
      where: { id },
      data: { ...fields },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
