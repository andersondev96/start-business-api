import type { PrismaClient } from '../../src/database/test-client'

declare global {
  // prisma só existe nos testes
  // e é o client de TESTE, não o principal
  var prismaTest: PrismaClient
}

export {}
