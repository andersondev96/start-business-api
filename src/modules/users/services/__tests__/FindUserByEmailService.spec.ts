import { AppError } from '@shared/errors/AppError'
import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { FindUserByEmailService } from '../FindUserByEmailService'

let fakeUsersRepository: IUsersRepository
let findUserByEmailService: FindUserByEmailService

describe('FindUserByEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    findUserByEmailService = new FindUserByEmailService(fakeUsersRepository)
  })

  it('Should be able to find user by email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const findUser = await findUserByEmailService.execute('john@example.com')

    expect(findUser).toEqual(
      expect.objectContaining({
        id: user.id,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
      })
    )
    expect(findUser).toHaveProperty('createdAt')
  })

  it('Should not be able to find a user with a non-existent email', async () => {
    await expect(
      findUserByEmailService.execute('invalid-email@test.com')
    ).rejects.toBeInstanceOf(AppError)
  })
})
