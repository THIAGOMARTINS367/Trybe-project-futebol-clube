# Boas vindas ao repositório do Trybe Futebol Clube!

<details>

<summary><strong> Descrição Geral</strong></summary><br />

---

## O que foi desenvolvido

Foi desenvolvido uma "API Node" para um site informativo sobre partidas e classificações de futebol! ⚽️

---

## Habilidades requeridas

- Ter conhecimento em `NodeJS` para construção de API's utilizando a lib `Express`;

- Implementar em `TypeScript`;

- Ter conhecimento em `POO` e dos princípios do `SOLID`;

- Conhecer a Arquitetura de Software `MSC`;

- Aplicar o conjunto de boas práticas `REST` & `RESTfull`;

- Criar Testes de Integração usando as lib's `mocha`, `chai`, e `sinon`;

- Implementar e saber utilizar `ORM's` para manuseio do Banco de Dados (Sequelize);

- Saber utilizar o `Docker` e criar Dockerfile's;

---

## Tecnologias usadas

- `TypeScript`, `NodeJS`, `Docker`, `Sequelize` e `Jest`.

---

## Desmontração de Uso

### *Em produção*...

---

</details>

<details>
<summary><strong>Contexto Inicial para o Desenvolvimento</strong></summary><br />

  ![Exemplo app front](assets/front-example.png)

  No time de desenvolvimento do `TFC`, seu *squad* ficou responsável por desenvolver uma API (utilizando o método `TDD`) e também integrar *- através do docker-compose -* as aplicações para que elas funcionem consumindo um banco de dados.

  Nesse projeto, você vai construir **um back-end dockerizado utilizando modelagem de dados através do Sequelize**. Seu desenvolvimento deve **respeitar regras de negócio** providas no projeto e **sua API deve ser capaz de ser consumida por um front-end já provido nesse projeto**.

  Para adicionar uma partida é necessário ter um _token_, portanto a pessoa deverá estar logada para fazer as alterações. Teremos um relacionamento entre as tabelas `teams` e `matches` para fazer as atualizações das partidas.

  O seu back-end deverá implementar regras de negócio para popular adequadamente a tabela disponível no front-end que será exibida para a pessoa usuária do sistema.

</details>

<details>
<summary><strong> Estrutura do projeto</strong></summary><br />

O projeto é composto de 4 entidades importantes para sua estrutura:

1️⃣ **Banco de dados:**
  - Um container docker MySQL já configurado no docker-compose através de um serviço definido como `db`.
  - Tem o papel de fornecer dados para o serviço de _backend_.
  - Durante a execução dos testes sempre vai ser acessado pelo `sequelize` e via porta `3002` do `localhost`; 
  - Também é possível conectar a um Cliente MySQL (Workbench, Beekeeper, DBeaver e etc), colocando as credenciais configuradas no docker-compose no serviço `db`.

2️⃣ **Back-end:** 
 - Roda na porta `3001`, pois o front-end faz requisições para ele nessa porta por padrão;
 - Inicializado a partir do arquivo `app/backend/src/server.ts`;
 - Todas as dependências extras foram listadas em `app/backend/packages.npm`.

3️⃣ **Front-end:**
  - O front já está concluído . A única exceção foi o Dockerfile que precisou ser configurado.
  - Todos os testes a partir do requisito de login usam o `puppeteer` para simular uma pessoa acessando o site `http://localhost:3000/`; 
  - O front se comunica com serviço de back-end pela url `http://localhost:3001` através dos endpoints implementados.

4️⃣ **Docker:**
  - O `docker-compose` tem a responsabilidade de unir todos os serviços conteinerizados (backend, frontend e db) e subir o projeto completo com o comando `npm run compose:up` ou `npm run compose:up:dev`;
  - Os arquivos `Dokerfile` são responsáveis por criar as imagens utilizando o código implementado tanto do Front-End quanto do Back-End para serem inseridos no container docker.
  
<details>
  <summary><strong> 🗓 Prazo</strong></summary><br />

  * O projeto TEVE um prazo de `7` dias para ser entregue.

</details>

<details>
<summary><strong>🕵️ Linter</strong></summary><br />

Para garantir a qualidade do código, foi usdo o [ESLint](https://eslint.org/) para fazer a análise estática do código.

Este projeto já vem com as dependências relacionadas ao _linter_ configuradas nos arquivos `package.json` nos seguintes caminhos:

- `Trybe-project-futebol-clube/app/backend/package.json`

Para rodar o `ESLint`, basta executar o comando `npm run lint` na raiz da pasta `backend` no caminho `Trybe-project-futebol-clube/app/backend`. Se a análise do `ESLint` encontrar problemas no código, tais problemas serão mostrados no terminal. Se não houver problema no código, nada será impresso no seu terminal.

⚠️**Atenção:** Pull Requests com issues de linter não serão consideradas. Foi nescessário resolvê-las antes de finalizar o desenvolvimento.

</details>

<details>
<summary><strong> ⚠️ Configurações mínimas para execução do projeto</strong></summary><br />

Na sua máquina você deve ter:

 - Sistema Operacional Distribuição Unix
 - Node versão 16  
 - Docker
 - Docker-compose versão >=1.29.2

➡️ O `node` deve ter versão igual ou superior à `16.15.0 LTS`:
	- Para instalar o nvm, [acesse esse link](https://github.com/nvm-sh/nvm#installing-and-updating);
	- Rode os comandos abaixo para instalar a versão correta de `node` e usá-la:
		- `nvm install 16 --lts`
		- `nvm use 16`
		- `nvm alias default 16` 

➡️ O`docker-compose` deve ter versão igual ou superior à`ˆ1.29.2`:
	* Use esse [link de referência para realizar a instalação corretamente no ubuntu](https://app.betrybe.com/course/back-end/docker/orquestrando-containers-com-docker-compose/6e8afaef-566a-47f2-9246-d3700db7a56a/conteudo/0006a231-1a10-48a2-ac82-9e03e205a231/instalacao/abe40727-6310-4ad8-bde6-fd1e919dadc0?use_case=side_bar);
	* Acesse o [link da documentação oficial com passos para desinstalar] (https://docs.docker.com/compose/install/#uninstallation) caso necessário.

</details>


<details>
<summary><strong> ⚠️ Inicialização do compose e verificação dos logs das aplicações </strong></summary><br />

- Considerando o uso do parâmetro `healthcheck` em cada container do `docker-compose.yml`, a inicialização dos containers deve aguardar o comando de status de saúde (o que valida se aquele container está operacional ou não):
  - No container `db`, representado por um comando `ping` no banco de dados;
  - No back-end, representado por um comando `lsof`, que vai procurar aplicações ativas na porta definida (por padrão, no caso `3001`);
  - No front-end, representado por um comando `lsof`, que vai procurar aplicações ativas na porta definida (por padrão, no caso `3000`).

- Caso os containers respeitem as premissas anteriores, os mesmos serão criados sem maiores problemas:

![Criação dos containers concluída com sucesso!](assets/compose-status-01.png)

- Em caso de algum problema (no back-end, por exemplo), você deve se deparar com alguma mensagem do tipo:

![Erro no status de saúde do container do back-end](assets/compose-status-03.png)

</details>

<details id='Variaveis-de-ambiente'>
<summary><strong> ⚙️ Variáveis de ambiente </strong></summary><br />

  **No diretório `app/backend/` renomeie o arquivo `.env.example` para `.env` e configure os valores de acordo com o cenário do seu ambiente (credenciais de banco de dados, secrets desejadas e etc)**. Isso vai permitir que você inicialize a aplicação fora do _container_ e ela se conecte com seu banco local caso deseje. 
 > `./app/backend/.env.example` 
 
  ```txt
  JWT_SECRET=jwt_secret
  APP_PORT=3001
  DB_USER=seu_user
  DB_PASS=sua_senha
  DB_HOST=localhost 
  DB_PORT=3306
  ```

</details>

<details id='Criptografia-de-senhas'>
<summary><strong>🔐 Criptografia de senhas </strong></summary><br />

⚠️ A biblioteca utilizada para criptografar a senha no banco de dados é a `bcryptjs` [bcryptjs npm](https://www.npmjs.com/package/bcryptjs) e que já vem instalada no projeto e não deve ser alterada ou substituída.

</details>

<details id='sequelize'>
  <summary><strong>🎲 Sequelize</strong></summary>
  <br/>

  Para o desenvolvimento, o time de produto disponibilizou um *Diagrama de Entidade-Relacionamento (DER)* para construir a modelagem do banco de dados. 
 
    ![Exemplo banco de dados](assets/er-diagram.png)

  ⚠️ O `package.json` do diretório `app/backend` contém um script `db:reset` que é responsável por "dropar" o banco, recriar e executar as _migrations_ e _seeders_. Você pode executá-lo com o commando `npm run db:reset` se por algum motivo precisar recriar a base de dados;

  ⚠️ Já existem _seeders_ prontas em `app/backend/src/database/seeders`. São usadas para popuar o banco de dados com dados iniciais.

  ⚠️ Quaisquer execução referente ao sequelize-cli deve ser realizada dentro do diretório `app/backend`. Certifique-se de que antes de rodar comandos do sequelize já exista uma versão compilada do back-end (diretório `app/build`), caso contrário basta executar `npm run build` para compilar. O sequelize só funcionará corretamente se o projeto estiver compilado.

  ⚠️ **O sequelize já foi inicializado, portanto NÃO é necessário executar o `sequelize init` novamente**

</details>


<details id='testes-de-cobertura'>
  <summary><strong> Testes de cobertura </strong></summary><br/>

  A construção de testes de cobertura no back-end foram feitos em *TypeScript*, utilizando `mocha`, `chai` e `sinon`, na pasta `app/backend/src/tests/`.

  Os testes cobrem os arquivos contidos em `app/backend/src`, com exceção daqueles que já foram entregues pré-prontos.

  Para rodar testes de cobertura no back-end, utilize o comando: `npm run test:coverage`.

</details>

<details>
  <summary><strong>ℹ️ Status HTTP</strong></summary><br />

  Foi mantido em mente que todas as "respostas" deverião respeitar os [status do protocolo HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status), com base no que o REST prega.

  Alguns exemplos:

  - Requisições que precisam de token mas não o receberam devem retornar um código de `status 401`;

  - Requisições que não seguem o formato pedido pelo servidor devem retornar um código de `status 400`;

  - Um problema inesperado no servidor deve retornar um código de `status 500`;

  - Um acesso ao criar um recurso, no nosso caso usuário ou partida, deve retornar um código de `status 201`.

  - Quando solicitado algo que não existe no banco, deve retornar um código de `status 404`.

</details>


<details>
  <summary><strong> 👀 Comandos úteis para rodar o projeto localmente </strong></summary><br />

  - Você pode **instalar as aplicações front e back** rodando o comando `npm run install:apps` na pasta raiz do projeto;
  - Você pode **subir ou descer uma aplicação do compose**, utilizando `npm run` com os scripts `compose:up`, `compose:down`, ou `compose:up:dev`, `compose:down:dev`;
  - Os comando de _compose_ anteriores estão configurados para executar o _docker-compose_ com o terminal desanexado (detached mode `-d`). Caso queira acompanhar os logs de um serviço em tempo real pelo terminal, basta executar `npm run logs [nome_do_servico]` onde _nome_do_servico_ é opcional e pode receber os serviços _backend_, _frontend_ ou _db_

</details>

<summary><strong> Visão Geral </strong></summary>

Esse projeto é composto de 4 seções principais:
1. User e Login
2. Times
3. Partidas
4. Placar
</details>
