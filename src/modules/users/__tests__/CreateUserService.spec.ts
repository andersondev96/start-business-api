import { FakeEntrepreneursRepository } from '@modules/entrepreneurs/repositories/Fakes/FakeEntrepreneursRepository'
import { FakeEntrepreneursSettingsRepository } from '@modules/entrepreneurs/repositories/Fakes/FakeEntrepreneursSettingsRepository'
import { AppError } from '@shared/errors/AppError'

import { FakeHashProvider } from '../providers/HashProvider/Fakes/FakeHashProvider'
import { FakeUsersRepository } from '../repositories/Fakes/FakeUsersRepository'
import { CreateUserService } from '../services/CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeEntrepreneurRepository: FakeEntrepreneursRepository
let fakeEntrepreneurSettingsRepository: FakeEntrepreneursSettingsRepository
let fakeHashProvider: FakeHashProvider
let createUserService: CreateUserService

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeEntrepreneurRepository = new FakeEntrepreneursRepository()
    fakeEntrepreneurSettingsRepository =
      new FakeEntrepreneursSettingsRepository()

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeEntrepreneurRepository,
      fakeEntrepreneurSettingsRepository,
      fakeHashProvider
    )
  })

  it('should be able to create a new standard user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      isEntrepreneur: false,
    })

    expect(user).toHaveProperty('id')
    expect(user.email).toBe('john@example.com')

    expect(user).not.toHaveProperty('password')
  })

  it('should be able to create a new user with entrepreneur profile', async () => {
    const user = await createUserService.execute({
      name: 'Elon Musk',
      email: 'elon@tesla.com',
      password: 'mars_mission',
      isEntrepreneur: true,
    })

    expect(user).toHaveProperty('id')

    const createdEntrepreneur = await fakeEntrepreneurRepository.findByUser(
      user.id!
    )

    expect(createdEntrepreneur).toBeTruthy()
    expect(createdEntrepreneur.user_id).toBe(user.id)

    const createdSettings =
      await fakeEntrepreneurSettingsRepository.findByEntrepreneur(
        createdEntrepreneur.id
      )
    expect(createdSettings).toBeTruthy()
  })

  it('should not be able to create a user with duplicate email', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(
      createUserService.execute({
        name: 'John Doe Duplicate',
        email: 'john@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
