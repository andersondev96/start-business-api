# Trabalho de conclusão de curso (TCC)
Projeto desenvolvido para o trabalho de conclusão de curso (TCC) de Sistemas de Informação - UFOP.



<div>
 <img src="https://img.shields.io/github/license/andersondev96/tcc-api"/>
  <img src="https://img.shields.io/github/last-commit/andersondev96/tcc-api"/>
</div>
<br>
<b> Índice </b>
<div>
<ul>
<li><a href="#-sobre-o-projeto">Sobre o projeto</a></li>
<li><a href="#-tecnologias-utilizadas">Tecnologias utilizadas</a></li>
<li><a href="#-requisitos">Requisitos</a></li>
<li><a href="#-banco-de-dados">Banco de dados</a></li>
<li><a href="#-como-executar-a-aplicação">Como executar a aplicação</a></li>
<li><a href="#-deploy-da-aplicação">Deploy da aplicação</a></li>
<li><a href="#-como-contribuir">Como contribuir</a></li>
<li><a href="#-licença">Licença</a></li>
<li><a href="#-autor">Autor</a></li>
</ul>
<div>


## 📄 Sobre o projeto

O projeto desenvolvido tem o objetivo de auxiliar os microempreendedores individuais (MEIs), por meio de um sistema que permite divulgar os seu negócio e serviços, aproximando do seu público-alvo e aumentando o seu alcance.

## 🧑‍💻 Tecnologias utilizadas

Para a implementação do servidor, foi utilizada como linguagem de programação o TypeScript, com os bancos de dados Postgres e Redis e a biblioteca do Node.js.

<div>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  </a>
  <a href="https://nodejs.org/en" target="_blank">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
  </a>
  <a href="https://www.postgresql.org/" target="_blank">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
  </a>
  <a href="https://redis.io/" target="_blank">
    <img src="https://img.shields.io/badge/Redis-D9281A?style=for-the-badge&logo=redis&logoColor=white">
  </a>
  <a href="https://www.docker.com/" target="_blank">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  </a>
  <a href="https://expressjs.com/pt-br/">
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
  </a>
  <a href="https://babeljs.io/">
    <img src="https://img.shields.io/badge/Babel-F9DC3e?style=for-the-badge&logo=babel&logoColor=black">
  </a>
  <a href="https://www.prisma.io/">
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white">
  </a>
  <a href="https://socket.io/">
    <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101">
  </a>
  <a class="https://jwt.io/">
    <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens">
  </a>
  <a class="https://jestjs.io/pt-BR/">
    <img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white">
  </a>
  <a class="https://eslint.org/">
    <img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white">
  </a>
</div>


## 🔧 Requisitos

### Usuários
<ul>
  <li>Autenticar usuário</li>
  <li>Cadastrar usuário</li>
  <li>Recuperar senha</li>
  <li>Criar refresh token</li>
  <li>Editar usuário</li>
  <li>Excluir usuário</li>
</ul>

### MEIs
<ul>
  <li>Cadastrar MEIs</li>
  <li>Editar MEIs</li>
  <li>Listar MEIs</li>
  <li>Favoritar MEIs</li>
  <li>Avaliar MEIs</li>
  <li>Excluir MEIs</li>
  <li>Adicionar imagens de MEIs</li>
</ul>

### Serviços
<ul>
  <li>Adicionar serviços</li>
  <li>Editar serviços</li>
  <li>Listar serviços</li>
  <li>Filtrar serviços</li>
  <li>Favoritar serviços</li>
  <li>Avaliar serviços</li>
  <li>Excluir serviços</li>
  <li>Adicionar imagens de serviços</li>
  <li>Fazer <i>upload</i> de uma lista de serviços através de um arquivo <i>.xlsx</i>
</ul>


### Orçamentos
<ul>
  <li>Criar uma solicitação de orçamento para o empreendedor</li>
  <li>Listar orçamentos do cliente</li>
  <li>Listar propostas de orçamentos do empreendedor</li>
  <li>Criar orçamento para o cliente</li>
  <li>Pesquisar por orçamentos</li>
  <li>Editar orçamentos</li>
  <li>Enviar orçamentos</li>
  <li>Aceitar ou recusar orçamentos</li>
</ul>

### Chat
<ul>
  <li>Acessar chat</li>
  <li>Iniciar conversa</li>
  <li>Enviar mensagens para o empreendedor</li>
</ul>


### Clientes
<ul>
  <li>Listar clientes</li>
  <li>Pesquisar clientes</li>
</ul>

### Configurações
<ul>
  <li>Atualizar configurações</li>
  <li>Remover conta</li>
</ul>

## 🔑 Banco de dados

O banco de dados principal foi o potgreSQL, abaixo é exibido o diagrama ER com as tabelas e relacionamentos.

<img src="tcc-api - public.png">

## 🚀 Como executar a aplicação
Antes de executar a aplicação certifique que você tenha instalada uma versão LTS do Node, npm e docker.

Para executar a aplicação deve seguir os seguintes passos:

<ol>
  <li>Clone o repositório:
  <code>https://github.com/andersondev96/tcc-api</code>
  <li>Abra o terminal e acesse a pasta <code>tcc-api</code> com o comando: <code>cd tcc-api</code>
  <li>Instale as dependências do projeto:<br>
  <code>npm install</code> ou <code>yarn install</code>
  <li>Configure as variáveis ambiente:

<br>

  ```
  APP_ENV="local"

# APP URLS LOCAL
APP_API_URL="http://localhost:3333"
APP_WEB_URL="http://localhost:3000"

# DATABASE
DATABASE_URL="postgresql://database:password@localhost:5432/tcc-api?schema=public"
APP_SECRET_TOKEN=your-secret-token
APP_SECRET_REFRESH_TOKEN=your-secret-refresh-token

# GOOGLE MAPS API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

## Storage
disk=local

## Email
MAIL_PROVIDER=s3

#Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

  ```

  </li>
  <li>Execute as migrations do prisma: <br>
  <code>npx prisma migrate dev</code></li>
  <li>
    Com tudo configurado você poderá acessar a aplicação com o comando
    
  <code>npm run dev</code>
  </li>
  <li>A aplicação será executada na porta <code>3333</code> do servidor. Para acessar as rotas você precisar de um software para realizar requisições HTTP, como o Postman ou Insomnia. Nele você poderá acessar as rotas, com a seguinte URL:
  
<code>http://localhost:3333</code></li>

As collections estão disponíveis no link abaixo:

<a href="./insomnia-All_2023-10-15.json">Collections</a>

</ol>

## ⚙ Deploy da aplicação
O deploy da aplicação foi feito utilizando a plataforma AWS da Amazon, utilizando o EC2.

Para o deploy foi criada uma máquina virtual do ubuntu e configurada as chaves de SSH.

Além disso foi utilizado o Proxy Reverso, com o <i>nginx</i> e o PM2 para gerenciar os processos do Node.

## 🤝 Como contribuir
<ol>
<li>
  Faça um fork do repositório.
  Crie uma nova branch com as suas alterações:
  
  <code>git checkout -b my-feature</code>
  </li>

<li>Salve as suas alterações e crie uma mensagem de commit, dizendo o que você fez: 
  
  <code>git commit -m "feature: My new feature"</code>
</li>

<li>
Envie as suas alterações: 
  
  <code>git push origin my-feature</code>
</li>
</ol>

## 📝 Licença
 <p>Este projeto está sobre a licença <a href="LICENSE">MIT</a>.

## 👥 Autor

<div style="display:flex; flex-direction:column; align-items: center;">
  <a href="https://www.linkedin.com/in/anderson-fernandes96/">
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px">
    <img src="https://avatars.githubusercontent.com/u/49786548?v=4" width="64" style="border: 2px solid blue; border-radius: 50px" />
    <strong>Anderson Fernandes Ferreira</strong>
    </div><br>
    <div style="display:flex; flex-direction:row;gap:8px;">
  <a href="https://instagram.com/anderson_ff13" target="_blank"><img src="https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white" target="_blank"></a>
  <a href = "mailto:andersonfferreira96@gmail.com.br"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a> 
  <a href="https://www.linkedin.com/in/anderson-fernandes96/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a> 
  </div>
</div>

</a>
<br>
<p style="text-align: center;">
  Feito com 💚 por Anderson Fernandes 👋 
  <a href="https://www.linkedin.com/in/anderson-fernandes96/">Entre em contato!</a>
  <br>
</p>
