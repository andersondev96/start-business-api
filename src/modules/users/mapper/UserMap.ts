import { User as PersistenceUser } from '@prisma/client'
import { User, Role } from '../infra/prisma/entities/User'
import { IUserResponseDTO } from '../dtos/IUserResponseDTO'

export class UserMap {
  static toDomain(raw: PersistenceUser): User {
    const user = new User(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        avatar: raw.avatar,
      },
      raw.id,
    )

    return user
  }

  static toDTO(user: User): IUserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
      role: user.role,
      createdAt: user.createdAt,
    }
  }
}
