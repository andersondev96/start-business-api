import { PrismaClient } from '../../../../database/test-client'

export class UsersRepositoryTest {
  constructor(private prisma: PrismaClient) {}

  async create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data })
  }
}
