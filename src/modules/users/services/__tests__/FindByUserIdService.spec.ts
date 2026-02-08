import { AppError } from '@shared/errors/AppError'

import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { FindByUserIdService } from '../FindByUserIdService'

let fakeUsersRepository: IUsersRepository
let findByUserIdService: FindByUserIdService

describe('DeleteUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    findByUserIdService = new FindByUserIdService(fakeUsersRepository)
  })

  it('Should be able find to user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const findUser = await findByUserIdService.execute(user.id)

    expect(findUser).toEqual({
      avatar: undefined,
      avatar_url: undefined,
      email: 'john@example.com',
      name: 'John Doe',
      id: findUser.id,
    })
  })

  it('Should not be able find to invalid user', async () => {
    await expect(
      findByUserIdService.execute('invalid-id')
    ).rejects.toBeInstanceOf(AppError)
  })
})
