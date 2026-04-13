# Trabalho de Conclusão de Curso (TCC)

Projeto desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do curso de Sistemas de Informação - UFOP.

![License shields](https://img.shields.io/github/license/andersondev96/start-business-api?style=for-the-badge&color=green)
![Last commit shields](https://img.shields.io/github/last-commit/andersondev96/start-business-api?style=for-the-badge&color=green)

## 📌 **Índice**

- [📄 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🔧 Requisitos do software](#-requisitos-do-software)
- [📂 Banco de Dados](#-banco-de-dados)
- [⚙ Como Executar a Aplicação](#-como-executar-a-aplicação)
- [🌍 Deploy da Aplicação](#-deploy-da-aplicação)
- [🤝 Como Contribuir](#-como-contribuir)
- [📝 Licença](#-licença)
- [👥 Autor](#-autor)

---

## 📄 Sobre o Projeto

O projeto tem como objetivo auxiliar microempreendedores individuais (MEIs) por meio de um sistema que permite a divulgação de seus negócios e serviços, aproximando-os do público-alvo e ampliando seu alcance.

> ### ⚠️ **Status do Projeto:**
>
> Em manutenção - Alguns recursos podem não estar funcionando corretamente.

---

## 🚀 Tecnologias Utilizadas

O servidor foi desenvolvido em **TypeScript**, utilizando **Node.js**, **PostgreSQL**, **Redis** e diversas bibliotecas para garantir eficiência e segurança.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-D9281A?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/pt-br/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/-vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 🔧 Requisitos do software

### Usuários

- [x] Autenticação
- [x] Cadastro e edição de usuários
- [x] Recuperação de senha
- [x] Exclusão de conta

### MEIs

- [x] Cadastro e edição
- [x] Listagem e avaliação
- [x] Adição de imagens
- [x] Favoritar MEIs

### Serviços

- [x] Gerenciamento completo de serviços (criar, editar, listar, excluir, avaliar, favoritar)
- [x] Filtro de serviços
- [x] Upload de serviços via arquivo `.xlsx`

### Orçamentos

- [x] Solicitação e gerenciamento de orçamentos
- [x] Edição e envio de orçamentos
- [x] Aceitação ou recusa de propostas

### Chat

- [x] Acesso e envio de mensagens para empreendedores

### Configurações

- [x] Atualização de preferências
- [x] Remoção de conta

---

## 📂 Banco de Dados

O banco de dados utilizado é o **PostgreSQL**. Abaixo está o diagrama ER:

<img src="tcc-api - public.png">

---

## ⚙ Como Executar a Aplicação

### **Pré-requisitos**

Antes de iniciar, certifique-se de ter:

- [Node.js (versão LTS recomendada)](https://nodejs.org/en/)
- NPM ou PNPM
- [Docker](https://www.docker.com/)

### **Passos para Execução**

1. Clone o repositório:
   ```sh
   git clone https://github.com/andersondev96/start-business-api
   ```
2. Acesse a pasta do projeto:
   ```sh
   cd start-business-api
   ```
3. Instale as dependências:
   ```sh
   npm install # ou pnpm install
   ```
4. Configure as variáveis de ambiente no arquivo `.env`
5. Execute as migrations do Prisma:
   ```sh
   npx prisma migrate dev
   ```
6. Inicie a aplicação:
   ```sh
   npm run dev # ou pnpm run dev
   ```
7. A API estará disponível em: [http://localhost:3333](http://localhost:3333).

As **collections** para testes estão disponíveis no arquivo `insomnia-All_2023-10-15.json`.

---

## 🧪 Testes

Para rodar os testes automatizados:

```
npm run test
```

**Tecnologias utilizadas para os testes:** Vitest.

---

## 🌍 Deploy da Aplicação

O deploy foi realizado na **AWS EC2** com as seguintes configurações:

- Servidor: **Ubuntu**
- Proxy Reverso: **Nginx**
- Gerenciamento de processos: **PM2**
- Certificado de segurança SSL: **Certbot**
- Armazenamento de Dados: **PostgreSQL & Redis**

Para acessar a API utilize o endereço [https://api-start-business.andersondev.tech/](https://api-start-business.andersondev.tech/).

Você poderá realizar requisições HTTP, utilizando softwares como o [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/).

---

## 🤝 Como Contribuir

1. Fork este repositório
2. Crie uma branch para sua funcionalidade:
   ```sh
   git checkout -b minha-feature
   ```
3. Realize suas alterações e comite:
   ```sh
   git commit -m "feature: Minha nova funcionalidade"
   ```
4. Envie para o repositório remoto:
   ```sh
   git push origin minha-feature
   ```
5. Abra um **Pull Request**!

---

## 📝 Licença

Este projeto está sob a licença [LICENSE](LICENSE).

---

## 👥 Autor

<div style="display:flex; flex-direction:column; align-items: center;">

<a href="https://www.linkedin.com/in/anderson-fernandes96/">
<img src="https://avatars.githubusercontent.com/u/49786548?v=4" width="64" style="border: 2px solid blue; border-radius: 50px" />
</a>

**Anderson Fernandes Ferreira**

[![Instagram](https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/anderson_ff13)
[![Gmail](https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white)](mailto:andersonfferreira96@gmail.com.br)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anderson-fernandes96/)

---

Feito com 💚 por **Anderson Fernandes** 👋
[Entre em conanto](https://www.linkedin.com/in/anderson-fernandes96/)

</div>
