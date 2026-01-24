import { PrismaClient } from '@prisma/client'

export const prismaTest = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
})
