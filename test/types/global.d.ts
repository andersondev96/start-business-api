declare global {
  // para usar prisma diretamente nos testes
  var prisma: import('@prisma/client').PrismaClient
}

export {}
