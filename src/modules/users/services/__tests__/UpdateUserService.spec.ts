import { AppError } from '@shared/errors/AppError'

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO'
import { FakeHashProvider } from '../../providers/HashProvider/Fakes/FakeHashProvider'
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider'
import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { UpdateUserService } from '../UpdateUserService'

let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider
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
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    }
    const userCreate = await fakeUsersRepository.create(user)

    userCreate.name = 'John Doe Updated'
    userCreate.email = 'john2@example.com'

    const updatedUser = await updateUserService.execute(user)

    expect(updatedUser).toHaveProperty('name', 'John Doe Updated')
    expect(updatedUser).toHaveProperty('email', 'john2@example.com')
  })

  it('Should not be able to invalid update user', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      id: 'invalid-id',
    }

    await expect(updateUserService.execute(user)).rejects.toBeInstanceOf(
      AppError
    )
  })

  it('Should be able update user if password not informed', async () => {
    const user = {
      name: 'User 1',
      email: 'user1@example.com',
      password: '12345678',
    }

    const userCreated = await fakeUsersRepository.create(user)

    const userUpdated = await updateUserService.execute({
      id: userCreated.id,
      name: 'New Name',
      email: 'userupdated@example.com',
    })

    expect(userCreated.password).toEqual(userUpdated.password)
  })

  it('Should not be able update user if email already exists', async () => {
    const user1: ICreateUserDTO = {
      name: 'User 1',
      email: 'user1@example.com',
      password: '123456',
    }

    const user2: ICreateUserDTO = {
      name: 'User 2',
      email: 'user2@example.com',
      password: '123456',
    }

    const user1Create = await fakeUsersRepository.create(user1)
    const user2Create = await fakeUsersRepository.create(user2)

    user2Create.email = user1Create.email

    await expect(updateUserService.execute(user2)).rejects.toBeInstanceOf(
      AppError
    )
  })
})
