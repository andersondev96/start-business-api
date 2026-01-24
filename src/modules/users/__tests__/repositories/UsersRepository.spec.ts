import { prismaTest } from '@database/prisma-test'
import { UsersRepository } from '@modules/users/infra/prisma/repositories/UsersRepository'

describe('UsersRepository', () => {
  const repo = new UsersRepository(prismaTest)

  it('deve criar um usuário', async () => {
    const user = await repo.create({
      name: 'Anderson',
      email: 'test@example.com',
      password: '123',
    })
  })
})
