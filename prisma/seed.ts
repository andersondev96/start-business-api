import 'dotenv/config'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar 10 usuários
  const userPromises = Array.from({ length: 10 }).map(async () => {
    const name = faker.person.firstName()
    const email = faker.internet.email()

    // Verifica se o email já existe no banco (opcional, dependendo do seu caso)
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      // Caso o email já exista, cria um novo email único
      return prisma.user.create({
        data: {
          name,
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      })
    } else {
      return prisma.user.create({
        data: {
          name,
          email,
          password: faker.internet.password(),
        },
      })
    }
  })

  // Criar 5 empresas
  const companyPromises = Array.from({ length: 5 }).map(async () => {
    const userName = `${faker.person.firstName()}_${faker.string.uuid()}`
    const userEmail = faker.internet.email()

    const company = await prisma.user.create({
      data: {
        name: userName,
        email: userEmail,
        password: faker.internet.password(),
        Company: {
          create: {
            name: `${faker.company.name()}_${faker.string.uuid()}`,
            cnpj: faker.string.alpha(13),
            category: {
              create: {
                name: faker.commerce.department(),
                subcategories: faker.commerce.productAdjective(),
              },
            },
            physical_localization: true,
            description: faker.lorem.text(),
            services: faker.helpers.arrayElements(
              Array.from({ length: 10 }, () => faker.commerce.product())
            ),
            contact: {
              create: {
                telephone: faker.phone.number(),
                whatsapp: faker.phone.number(),
                email: faker.internet.email(),
                website: faker.internet.url(),
              },
            },
            Address: {
              create: {
                cep: faker.location.zipCode(),
                street: faker.location.street(),
                district: faker.location.secondaryAddress(),
                number: faker.number.int({ max: 100 }),
                state: faker.location.state({ abbreviated: true }),
                city: faker.location.city(),
                latitude: Number(faker.location.latitude()),
                longitude: Number(faker.location.longitude()),
              },
            },
            Schedule: {
              createMany: {
                data: [
                  {
                    weekday: faker.date.weekday(),
                    opening_time: faker.string.numeric(2),
                    closing_time: faker.string.numeric(2),
                    lunch_time: faker.string.numeric(2),
                  },
                  {
                    weekday: faker.date.weekday(),
                    opening_time: faker.string.numeric(2),
                    closing_time: faker.string.numeric(2),
                    lunch_time: faker.string.numeric(2),
                  },
                  {
                    weekday: faker.date.weekday(),
                    opening_time: faker.string.numeric(2),
                    closing_time: faker.string.numeric(2),
                    lunch_time: faker.string.numeric(2),
                  },
                ],
              },
            },
            Service: {
              createMany: {
                data: Array.from({ length: 5 }).map(() => ({
                  name: faker.commerce.product(),
                  description: faker.commerce.productDescription(),
                  price: Number(faker.commerce.price()),
                  category: faker.commerce.department(),
                })),
              },
            },
          },
        },
      },
    })

    return company
  })

  // Espera todas as promessas
  await Promise.all([...userPromises, ...companyPromises])

  console.log('🌱 Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
