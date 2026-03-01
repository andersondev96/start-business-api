import type { Role } from '../infra/prisma/entities/User'

export interface IUserResponseDTO {
  id: string
  name: string
  email: string
  avatar: string | null
  role: Role
  createdAt: Date
}
