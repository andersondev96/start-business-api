import { prismaTest } from '../src/database/prisma-test'

beforeAll(async () => {
  await prismaTest.$connect()
})

beforeEach(async () => {
  // limpar tabelas antes de cada teste
  const tables = await prismaTest.$queryRaw<Array<{ name: string }>>`
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `

  for (const table of tables) {
    await prismaTest.$executeRawUnsafe(`DELETE FROM ${table.name}`)
  }
})

afterAll(async () => {
  await prismaTest.$disconnect()
})

globalThis.prisma = prismaTest
