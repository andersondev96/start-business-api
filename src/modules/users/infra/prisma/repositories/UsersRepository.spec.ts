import { describe, it, expect, beforeEach } from 'vitest'
import { prismaTest } from '@database/prisma-test'
import { PrismaClient } from '@prisma/client'
import { UsersRepository } from './UsersRepository'

const makeUserBody = () => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '123',
  avatar: null,
})

describe('UsersRepository Integration', () => {
  const usersRepository = new UsersRepository(
    prismaTest as unknown as PrismaClient
  )

  beforeEach(async () => {
    await prismaTest.user.deleteMany()
  })

  describe('create()', () => {
    it('should be able to create a user', async () => {
      const data = makeUserBody()

      const user = await usersRepository.create(data)

      expect(user).toHaveProperty('id')
      expect(user.email).toBe(data.email)

      expect(user.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('findById()', () => {
    it('should be able to find a user by ID', async () => {
      const createdUser = await usersRepository.create(makeUserBody())

      const foundUser = await usersRepository.findById(createdUser.id!)

      expect(foundUser).toEqual(
        expect.objectContaining({
          id: createdUser.id,
          email: createdUser.email,
        })
      )
    })

    it('should return null if user ID does not exist', async () => {
      const user = await usersRepository.findById('non-existing-uuid')

      expect(user).toBeNull()
    })
  })

  describe('findByMail()', () => {
    it('should be able to find a user by email', async () => {
      const data = makeUserBody()
      await usersRepository.create(data)

      const foundUser = await usersRepository.findByMail(data.email)

      expect(foundUser).toBeTruthy()
      expect(foundUser?.id).toBeDefined()
    })

    it('should return null if email does not exist', async () => {
      const user = await usersRepository.findByMail('ghost@example.com')

      expect(user).toBeNull()
    })
  })

  describe('update()', () => {
    it('should be able to update user', async () => {
      const createdUser = await usersRepository.create(makeUserBody())

      const updatedUser = await usersRepository.update({
        id: createdUser.id!,
        name: 'New Name',
        email: 'new@email.com',
      })

      expect(updatedUser.name).toBe('New Name')
      expect(updatedUser.email).toBe('new@email.com')

      expect(updatedUser.password).toBe(createdUser.password)
    })

    it('should throw an error when updating a non-existing user', async () => {
      const promise = usersRepository.update({
        id: 'non-existing-id',
        name: 'Ghost',
      })

      await expect(promise).rejects.toThrow()
    })
  })

  describe('delete()', () => {
    it('should be able to delete user', async () => {
      const createdUser = await usersRepository.create(makeUserBody())

      await usersRepository.delete(createdUser.id!)

      const foundUser = await usersRepository.findById(createdUser.id!)
      expect(foundUser).toBeNull()
    })

    it('should throw error when deleting a non-existing user', async () => {
      const promise = usersRepository.delete('non-existing-id')

      await expect(promise).rejects.toThrow()
    })
  })
})
