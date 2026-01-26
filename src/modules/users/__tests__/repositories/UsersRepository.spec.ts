import { prismaTest } from '@database/prisma-test'
import { UsersRepositoryTest } from './UserRepositoryTest'

describe('UsersRepository', () => {
  const repo = new UsersRepositoryTest(prismaTest)

  it('deve criar um usuário', async () => {
    const user = await repo.create({
      name: 'Anderson',
      email: 'test@example.com',
      password: '123',
    })
  })
})
