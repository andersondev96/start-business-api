import { describe, it, expect, beforeEach } from 'vitest'
import { prismaTest } from '@database/prisma-test'
import { PrismaClient } from '@prisma/client'
import { UsersTokenRepository } from './UsersTokenRepository'

const makeUserTokenBody = () => ({
  user_id: 'user-uuid-123',
  refresh_token: 'refresh-token-abc123',
  expires_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
})

describe('UsersTokenRepository Integration', () => {
  const usersTokenRepository = new UsersTokenRepository(prismaTest as unknown as PrismaClient)

  beforeEach(async () => {
    await prismaTest.userToken.deleteMany()
  })

  describe('create()', () => {
    it('should be able to create a user token', async () => {
      const data = makeUserTokenBody()

      const token = await usersTokenRepository.create(data)

      expect(token).toHaveProperty('id')
      expect(token.user_id).toBe(data.user_id)
      expect(token.refresh_token).toBe(data.refresh_token)
      expect(token.expires_date).toEqual(data.expires_date)
      expect(token.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('findByUserAndRefreshToken()', () => {
    it('should be able to find token by user_id and refresh_token', async () => {
      const createdToken = await usersTokenRepository.create(makeUserTokenBody())

      const foundToken = await usersTokenRepository.findByUserAndRefreshToken(
        createdToken.user_id,
        createdToken.refresh_token,
      )

      expect(foundToken).toBeTruthy()
      expect(foundToken?.id).toBe(createdToken.id)
      expect(foundToken?.user_id).toBe(createdToken.user_id)
      expect(foundToken?.refresh_token).toBe(createdToken.refresh_token)
    })

    it('should return null if token does not exist for user and refresh_token', async () => {
      const token = await usersTokenRepository.findByUserAndRefreshToken(
        'non-existing-user',
        'non-existing-refresh-token',
      )

      expect(token).toBeNull()
    })
  })

  describe('findByRefreshToken()', () => {
    it('should be able to find token by refresh_token', async () => {
      const createdToken = await usersTokenRepository.create(makeUserTokenBody())

      const foundToken = await usersTokenRepository.findByRefreshToken(createdToken.refresh_token)

      expect(foundToken).toBeTruthy()
      expect(foundToken?.id).toBe(createdToken.id)
      expect(foundToken?.refresh_token).toBe(createdToken.refresh_token)
    })

    it('should return null if refresh_token does not exist', async () => {
      const token = await usersTokenRepository.findByRefreshToken('non-existing-refresh-token')

      expect(token).toBeNull()
    })
  })

  describe('deleteById()', () => {
    it('should be able to delete token by ID', async () => {
      const createdToken = await usersTokenRepository.create(makeUserTokenBody())

      await usersTokenRepository.deleteById(createdToken.id!)

      const foundToken = await usersTokenRepository.findByRefreshToken(createdToken.refresh_token)

      expect(foundToken).toBeNull()
    })

    it('should throw error when deleting non-existing token', async () => {
      const promise = usersTokenRepository.deleteById('non-existing-id')

      await expect(promise).rejects.toThrow()
    })
  })
})
