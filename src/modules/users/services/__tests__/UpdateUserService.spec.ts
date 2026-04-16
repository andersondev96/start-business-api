import { vi } from 'vitest'
import { AppError } from '@shared/errors/AppError'

import { FakeHashProvider } from '../../providers/HashProvider/Fakes/FakeHashProvider'
import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { UpdateUserService } from '../UpdateUserService'

vi.mock('@shared/utils/getFilesUrl', () => ({
  getUserAvatarUrl: vi.fn(() => null),
}))

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateUserService: UpdateUserService

describe('Update User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateUserService = new UpdateUserService(fakeUsersRepository, fakeHashProvider)
  })

  it('Should be able to update a user', async () => {
    const userCreated = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const updatedUser = await updateUserService.execute({
      id: userCreated.id!,
      name: 'John Doe Updated',
      email: 'john2@example.com',
    })

    expect(updatedUser).toHaveProperty('name', 'John Doe Updated')
    expect(updatedUser).toHaveProperty('email', 'john2@example.com')
  })

  it('Should not be able to update a non-existent user', async () => {
    await expect(
      updateUserService.execute({
        id: 'non-existent-id',
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not update if email already exists', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      password: '123456',
    })

    const user2 = await fakeUsersRepository.create({
      name: 'User 2',
      email: 'user2@example.com',
      password: '123456',
    })

    await expect(
      updateUserService.execute({
        id: user2.id!,
        name: 'User 2',
        email: user1.email,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should keep password unchanged if not provided', async () => {
    const userCreated = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      password: '12345678',
    })

    await updateUserService.execute({
      id: userCreated.id!,
      name: 'New Name',
      email: 'userupdated@example.com',
    })

    const userInDb = await fakeUsersRepository.findById(userCreated.id!)

    expect(userInDb?.password).toEqual(userCreated.password)
  })

  it('Should update password if provided', async () => {
    const userCreated = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      password: 'old-password',
    })

    const newPassword = 'new-password-123'
    await updateUserService.execute({
      id: userCreated.id!,
      name: 'Updated Name',
      email: 'updated@example.com',
      password: newPassword,
    })

    const userInDb = await fakeUsersRepository.findById(userCreated.id!)

    expect(userInDb?.password).toBe(newPassword)
  })

  it('Should be able update user if password not informed', async () => {
    const userCreated = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      password: '12345678',
    })

    await updateUserService.execute({
      id: userCreated.id!,
      name: 'New Name',
      email: 'userupdated@example.com',
    })

    const userInDb = await fakeUsersRepository.findById(userCreated.id!)

    expect(userInDb?.password).toEqual(userCreated.password)
  })
})
