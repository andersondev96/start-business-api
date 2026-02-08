import { AppError } from '@shared/errors/AppError'

import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { DeleteUserService } from '../DeleteUserService'

let fakeUsersRepository: IUsersRepository
let deleteUserService: DeleteUserService

describe('DeleteUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    deleteUserService = new DeleteUserService(fakeUsersRepository)
  })

  it('Should be able delete to user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John doe',
      email: 'john@example.com',
      password: '123456',
    })

    await deleteUserService.execute(user.id)

    const findUser = await fakeUsersRepository.findById(user.id)

    expect(findUser).toBe(undefined)
  })

  it('Should not be able to delete a invalid user', async () => {
    await expect(
      deleteUserService.execute('invalid-id')
    ).rejects.toBeInstanceOf(AppError)
  })
})
