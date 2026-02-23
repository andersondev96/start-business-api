import { inject, injectable } from 'tsyringe'
import { IEntrepreneursRepository } from '@modules/entrepreneurs/repositories/IEntrepreneursRepository'
import { IEntrepreneursSettingsRepository } from '@modules/entrepreneurs/repositories/IEntrepreneursSettingsRepository'
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { AppError } from '@shared/errors/AppError'
import { UserMap } from '../mapper/UserMap'

interface IRequest {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'ENTREPRENEUR' | 'CUSTOMER'
}

type IResponse = ReturnType<typeof UserMap.toDTO>

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('EntrepreneursRepository')
    private entrepreneurRepository: IEntrepreneursRepository,

    @inject('EntrepreneursSettingsRepository')
    private entrepreneurSettingsRepository: IEntrepreneursSettingsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    name,
    email,
    password,
    role = 'CUSTOMER',
  }: IRequest): Promise<IResponse> {
    const userAlreadyExists = await this.userRepository.findByMail(email)

    if (userAlreadyExists) {
      throw new AppError('Email address already used')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    if (role === 'ENTREPRENEUR') {
      await this.createEntrepreneurProfile(user.id!)
    }

    return UserMap.toDTO(user)
  }

  private async createEntrepreneurProfile(userId: string): Promise<void> {
    const entrepreneur = await this.entrepreneurRepository.create({
      user_id: userId,
    })

    await this.entrepreneurSettingsRepository.create({
      entrepreneur_id: entrepreneur.id,
    })
  }
}
