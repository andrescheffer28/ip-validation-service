# Email da CT Junior - Projeto Piloto Back-End

Este projeto, consiste no desenvolvimento do back-end para a aplicação "Email da CT Junior". O objetivo é simular um sistema de e-mails.
A API é responsável por gerenciar usuários, autenticação, envio, recebimento e visualização de e-mails.

## Arquitetura e Conceitos

- O projeto foi desenvolvido seguindo princípios de Domain-Driven Design (DDD) e Arquitetura Limpa, separando as responsabilidades em camadas distintas:

  * core: Contém as peças fundamentais da arquitetura, como a classe Entity, o UniqueEntityID e o Either para tratamento de erros funcionais.

  * domain: Representa o coração da aplicação.

    *  enterprise/entities: Contém as entidades de domínio (User, Email) e os Value Objects (EmailWithSenderReceiverNames).

    *  application/use-cases: Orquestra as regras de negócio, recebendo dados da camada de infraestrutura e utilizando os repositórios para persistência.

    *  application/repositories: Define os contratos (classes abstratas) para a persistência de dados, desacoplando o domínio dos detalhes de implementação do banco de dados.

  * infra: Camada responsável pelos detalhes de implementação.

      *  database: Contém a implementação dos repositórios usando Prisma e o banco de dados PostgreSQL.

      *  http: Contém os Controllers (responsáveis por receber requisições HTTP), os Presenters (responsáveis por formatar os dados de resposta) e os módulos do NestJS.

      *  auth: Gerencia a autenticação via JWT.

## Tecnologias Utilizadas

  - NestJS: Um framework Node.js progressivo para construir aplicações server-side eficientes e escaláveis. Ele utiliza TypeScript por padrão e implementa conceitos de design de software como Injeção de Dependência, tornando o código modular e fácil de testar.

  - Prisma e Prisma Client: Um ORM (Object-Relational Mapper) de nova geração que simplifica o acesso e manipulação do banco de dados, oferecendo tipagem forte.

  - PostgreSQL: Um sistema de gerenciamento de banco de dados relacional, utilizado para a persistência de todos os dados da aplicação.

  - Docker: Utilizado para containerizar o ambiente do banco de dados PostgreSQL.

  - Zod: Uma biblioteca de declaração e validação de esquemas com foco em TypeScript. É usada para garantir a integridade e o formato correto dos dados recebidos.

  - Bcrypt: Empregado para o hashing seguro de senhas. Antes de salvar a senha de um usuário no banco de dados.

  - NestJS JWT e Passport: Módulos do NestJS que facilitam a implementação de autenticação baseada em JSON Web Tokens (JWT). O sistema utiliza um par de chaves assimétricas (RS256) para assinar e verificar os tokens, garantindo que apenas usuários autenticados possam acessar as rotas protegidas.

  - Vitest: Um framework de testes unitários e de integração extremamente rápido. Foi utilizado para criar testes unitários para os UseCases e testes End-to-End (E2E) para os Controllers.

## Código para gerar as chaves JWT-RS256
- openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
- base64 -w 0 private_key.pem > private_key_b64.txt

- openssl rsa -pubout -in private_key.pem -out public_key.pem
- base64 -w 0 public_key.pem > public_key_b64.txt

## API Endpoints

 ### Abaixo estão os principais endpoints disponíveis na API. Rotas marcadas como Autenticada exigem um token JWT no cabeçalho Authorization: Bearer <token>.
  |Endpoint	      | Método  |Descrição	                                                          |Autenticação
  | --------------|---------|---------------------------------------------------------------------|------------------
  | /user	        |POST	    |Cria um novo usuário.	                                              |Pública
  | /login	      |POST	    |Autentica um usuário e retorna um access_token.	                    |Pública
  | /my-emails	  |GET	    |Retorna a lista de e-mails recebidos pelo usuário autenticado.	      |Autenticada
  | /sent-emails  |GET	    |Retorna a lista de e-mails enviados pelo usuário autenticado.	      |Autenticada
  | /email	      |POST	    |Envia um novo e-mail para um destinatário.	                          |Autenticada
  | /email/:id	  |GET	    |Busca os detalhes de um e-mail específico pelo seu ID.	              |Autenticada
  | /email/:id	  |DELETE	  |Deleta um e-mail enviado, caso ainda não tenha sido lido.	          |Autenticada
  | /my-name	    |PATCH	  |Edita o nome do usuário autenticado.	                                |Autenticada
  | /my-image	    |PATCH	  |Edita a imagem de perfil do usuário autenticado.	                    |Autenticada
