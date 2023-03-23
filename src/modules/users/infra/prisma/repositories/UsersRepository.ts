import { prisma } from "@database/prisma";
import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { User } from "../entities/User";

export class UsersRepository implements IUsersRepository {

  async findById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    return user;
  }

  async create({ name, email, password, id, avatar }: ICreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        id,
        avatar
      }
    });

    return user;
  }

  async findByMail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return user;
  }

  public async addFavorite(user_id: string, table_id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id: user_id },
      data: { favorites: [table_id] }
    });

    return user;
  }

  async update(user: ICreateUserDTO): Promise<User> {
    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...user
      }
    });

    return updateUser;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
}
