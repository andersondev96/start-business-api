import { FakeCategoriesRepository } from '@modules/categories/repositories/fakes/FakeCategoriesRepository'
import { ICategoriesRepository } from '@modules/categories/repositories/ICategoriesRepository'
import { FakeCompaniesRepository } from '@modules/companies/repositories/fakes/FakeCompaniesRepository'
import { FakeContactsRepository } from '@modules/companies/repositories/fakes/FakeContactsRepository'
import { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository'
import { IContactsRepository } from '@modules/companies/repositories/IContactsRepository'
import { FakeServicesRepository } from '@modules/services/repositories/fakes/FakeServicesRepository'
import { IServicesRepository } from '@modules/services/repositories/IServicesRepository'

import { FakeUsersRepository } from '../../repositories/Fakes/FakeUsersRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { ListFavoritesService } from '../ListFavoritesService'

let fakeUserRepository: IUsersRepository
let fakeCompanyRepository: ICompaniesRepository
let fakeCategoryRepository: ICategoriesRepository
let fakeContactRepository: IContactsRepository
let fakeServiceRepository: IServicesRepository
let listFavoritesService: ListFavoritesService

describe('ListFavoritesService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository()
    fakeCompanyRepository = new FakeCompaniesRepository()
    fakeCategoryRepository = new FakeCategoriesRepository()
    fakeContactRepository = new FakeContactsRepository()
    fakeServiceRepository = new FakeServicesRepository()
    listFavoritesService = new ListFavoritesService(
      fakeUserRepository,
      fakeCompanyRepository,
      fakeServiceRepository
    )
  })

  it('Should be able to list favorites', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const contact = await fakeContactRepository.create({
      email: 'business@example.com',
      telephone: '123456',
    })

    const category = await fakeCategoryRepository.create({
      name: 'Category 1',
      subcategories:
        'Subcategory category 1,Subcategory category 2,Subcategory category 3',
    })

    const company = await fakeCompanyRepository.create({
      name: 'Business name',
      cnpj: '123456',
      category_id: category.id,
      description: 'Business Description',
      services: ['Service 1'],
      physical_localization: false,
      contact_id: contact.id,
      user_id: user.id,
    })

    const service = await fakeServiceRepository.create({
      name: 'Service One',
      description: 'Service Description',
      price: 20.0,
      category: 'Subcategory category 1',
      image_url: 'image_example.png',
      company_id: company.id,
    })

    await fakeUserRepository.addFavorite(user.id, company.id)
    await fakeUserRepository.addFavorite(user.id, service.id)

    await fakeUserRepository.findById(user.id)

    const favorites = await listFavoritesService.execute(user.id)

    expect(favorites).toEqual({
      companies: [company],
      services: [service],
    })
  })
})
