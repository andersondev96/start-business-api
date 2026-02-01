import { PrismaClient } from '@database/test-client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const testDbPath = path.resolve(__dirname, '../../test/test.db')

const adapter = new PrismaBetterSqlite3({ url: testDbPath })

export const prismaTest = new PrismaClient({ adapter })
