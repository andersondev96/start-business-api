import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar 10 usuários
  const userPromises = Array.from({ length: 10 }).map(async () => {
    const name = faker.name.firstName();
    const email = faker.internet.email();

    // Verifica se o email já existe no banco (opcional, dependendo do seu caso)
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Caso o email já exista, cria um novo email único
      return prisma.user.create({
        data: {
          name,
          email: faker.internet.email(),
          password: faker.internet.password()
        }
      });
    } else {
      return prisma.user.create({
        data: {
          name,
          email,
          password: faker.internet.password()
        }
      });
    }
  });

  // Criar 5 empresas
  const companyPromises = Array.from({ length: 5 }).map(async () => {
    const userName = faker.name.firstName();
    const userEmail = faker.internet.email();

    const company = await prisma.user.create({
      data: {
        name: userName,
        email: userEmail,
        password: faker.internet.password(),
        Company: {
          create: {
            name: faker.company.name(),
            cnpj: faker.random.alpha(13),
            category: {
              create: {
                name: faker.commerce.department(),
                subcategories: faker.commerce.productAdjective()
              }
            },
            physical_localization: true,
            description: faker.lorem.text(),
            services: faker.helpers.arrayElements(),
            contact: {
              create: {
                telephone: faker.phone.number(),
                whatsapp: faker.phone.number(),
                email: faker.internet.email(),
                website: faker.internet.url()
              }
            },
            Address: {
              create: {
                cep: faker.address.zipCode(),
                street: faker.address.street(),
                district: faker.address.secondaryAddress(),
                number: faker.datatype.number(),
                state: faker.address.stateAbbr(),
                city: faker.address.cityName(),
                latitude: Number(faker.address.latitude()),
                longitude: Number(faker.address.longitude())
              }
            },
            Schedule: {
              createMany: {
                data: [
                  {
                    weekday: faker.date.weekday(),
                    opening_time: faker.random.numeric(),
                    closing_time: faker.random.numeric(),
                    lunch_time: faker.random.numeric()
                  },
                  {
                    weekday: faker.date.weekday(),
                    opening_time: faker.random.numeric(),
                    closing_time: faker.random.numeric(),
                    lunch_time: faker.random.numeric()
                  },
                  {
                    weekday: faker.date.weekday(),
                    opening_time: faker.random.numeric(),
                    closing_time: faker.random.numeric(),
                    lunch_time: faker.random.numeric()
                  }
                ]
              }
            },
            Service: {
              createMany: {
                data: Array.from({ length: 5 }).map(() => ({
                  name: faker.commerce.product(),
                  description: faker.commerce.productDescription(),
                  price: Number(faker.commerce.price()),
                  category: faker.commerce.department()
                }))
              }
            }
          }
        }
      }
    });

    return company;
  });

  // Espera todas as promessas
  await Promise.all([...userPromises, ...companyPromises]);

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
