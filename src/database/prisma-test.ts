import { PrismaClient } from '@prisma/client'
import path from 'path'

const dbPath = path.resolve(__dirname, '../../test/prisma/test.db')

export const prismaTest = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
})
