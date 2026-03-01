import { AppError } from '@shared/errors/AppError'

import { FakeHashProvider } from '../../providers/HashProvider/Fakes/FakeHashProvider'
import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { UpdateUserService } from '../UpdateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateUserService: UpdateUserService

describe('Update User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateUserService = new UpdateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('Should be able to update a user', async () => {
    const userCreated = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const updatedUser = await updateUserService.execute({
      id: userCreated.id as string,
      name: 'John Doe Updated',
      email: 'john2@example.com',
    })

    expect(updatedUser).toHaveProperty('name', 'John Doe Updated')
    expect(updatedUser).toHaveProperty('email', 'john2@example.com')
  })

  it('Should not be able to update a non-existent user', async () => {
    await expect(
      updateUserService.execute({
        id: 'invalid-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should be able update user if password not informed', async () => {
    const userCreated = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      password: '12345678',
    })

    await updateUserService.execute({
      id: userCreated.id as string,
      name: 'New Name',
      email: 'userupdated@example.com',
    })

    const userInDb = await fakeUsersRepository.findById(
      userCreated.id as string
    )

    expect(userInDb?.password).toEqual(userCreated.password)
  })

  it('Should not be able update user if email already exists', async () => {
    const user1Created = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      password: '123456',
    })

    const user2Created = await fakeUsersRepository.create({
      name: 'User 2',
      email: 'user2@example.com',
      password: '123456',
    })

    await expect(
      updateUserService.execute({
        id: user2Created.id as string,
        name: 'User 2',
        email: user1Created.email,
      })
    ).rejects.toEqual(new AppError('Email address already used'))
  })
})
