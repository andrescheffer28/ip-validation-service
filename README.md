# 🛡️ API de E-mail Segura (Estudo de Validação por IP)

Este projeto é uma ramificação da API de "Email da CT Junior", criada como um ambiente prático para estudar **Segurança baseada em IP**, **Rate Limiting** e **Autenticação de Sessões**. 

A aplicação base simula um sistema de e-mails (com envio, recebimento e gestão de usuários), mas o foco deste repositório é entender como capturar, validar e utilizar o IP do cliente para proteger a infraestrutura do back-end contra acessos indevidos e ataques.

## 🎯 Objetivo da Funcionalidade de IP

A ideia central é criar uma camada extra de segurança onde um token de autenticação (JWT) esteja estritamente vinculado ao IP que originou o login. Caso o token seja roubado, ele não poderá ser utilizado a partir de uma rede diferente.

### 🚀 O que já foi implementado:
- **Rate Limiting (Proteção contra Força Bruta):** Utilização do `@nestjs/throttler` configurado para permitir no máximo 100 requisições por minuto por IP.
- **Identificação Real do Usuário (`CustomThrottlerGuard`):** Configuração do Express com `trust proxy: loopback` para garantir que a API leia o IP real do cliente, ignorando IPs de proxies internos ou load balancers.
- **Sessão Vinculada (Entidade `Coockie`):** O IP do usuário agora é exigido no UseCase de autenticação. Após o login, a sessão armazena o `userIP` junto com o ID do usuário e o token de acesso.

### 🚧 Próximos Passos (To-Do)
- [ ] Todas os use-cases que precisem de autenticação devem passar pela verificação do IP.
- [ ] Implementar a verificação do IP (via Guards ou Interceptors) diretamente para os Controllers.
- [ ] Criar um repositório no Prisma para a persistência das sessões (`Coockies`).

---

## 🏛️ Arquitetura e Conceitos

O projeto foi desenvolvido seguindo princípios de **Domain-Driven Design (DDD)** e **Arquitetura Limpa**, separando as responsabilidades em camadas distintas:

* **core:** Contém as peças fundamentais da arquitetura, como a classe `Entity`, o `UniqueEntityID` e o padrão `Either` para tratamento elegante de erros funcionais.
* **domain:** Representa o coração da aplicação.
  * **enterprise/entities:** Contém as entidades de domínio (`User`, `Email`, `Coockie`) e os Value Objects.
  * **application/use-cases:** Orquestra as regras de negócio (ex: `AuthenticateUserUseCase`), recebendo dados da infraestrutura e utilizando os repositórios.
  * **application/repositories:** Define os contratos (classes abstratas) para a persistência de dados, desacoplando o domínio do banco de dados.
* **infra:** Camada responsável pelos detalhes de implementação.
  * **database:** Implementação dos repositórios usando Prisma e PostgreSQL.
  * **http:** Controllers (recebem requisições HTTP), Presenters (formatam respostas) e módulos do NestJS.
  * **auth:** Gerencia a segurança, validação de tokens JWT e Guards de limitação de taxa (Throttler).

## 🛠️ Tecnologias Utilizadas

- **NestJS:** Framework Node.js utilizando TypeScript, Injeção de Dependência e arquitetura modular.
- **Prisma ORM & PostgreSQL:** Para modelagem tipada e persistência relacional.
- **Docker:** Containerização do ambiente do banco de dados.
- **Zod:** Validação rigorosa dos esquemas de dados recebidos nas requisições.
- **Bcrypt:** Hashing seguro para as senhas de usuários.
- **JWT (RS256) & Passport:** Autenticação baseada em tokens com criptografia assimétrica.
- **Vitest:** Framework ultra-rápido para testes unitários (UseCases) e testes End-to-End (E2E).

## 🔑 Código para gerar as chaves JWT-RS256

Para rodar o projeto localmente, gere as chaves pública e privada usando OpenSSL:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
base64 -w 0 private_key.pem > private_key_b64.txt

openssl rsa -pubout -in private_key.pem -out public_key.pem
base64 -w 0 public_key.pem > public_key_b64.txt