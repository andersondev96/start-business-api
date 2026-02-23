import { Role } from '../infra/prisma/entities/User'

export interface ICreateUserDTO {
  name: string
  email: string
  password: string
  avatar?: string | null
  role?: Role
}
