import { User as PersistenceUser } from '@prisma/client'
import { User } from '../infra/prisma/entities/User'
import { IUserResponseDTO } from '../dtos/IUserResponseDTO'

export class UserMap {
  static toDomain(raw: PersistenceUser): User {
    return new User({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      favorites: raw.favorites,
      avatar: raw.avatar,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }

  static toDTO(user: User): IUserResponseDTO {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
      favorites: user.favorites ?? [],
      createdAt: user.createdAt!,
    }
  }
}
