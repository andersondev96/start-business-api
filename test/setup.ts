import 'reflect-metadata'

import { prismaTest } from '@database/prisma-test'
import { beforeAll, beforeEach, afterAll } from 'vitest'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

beforeAll(async () => {
  const testDbPath = path.resolve(__dirname, '../test/test.db')
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath)
  }

  execSync('npm run db:test:push', { stdio: 'inherit' })

  await prismaTest.$connect()
})

beforeEach(async () => {
  await prismaTest.user.deleteMany()
})

afterAll(async () => {
  await prismaTest.$disconnect()
})
