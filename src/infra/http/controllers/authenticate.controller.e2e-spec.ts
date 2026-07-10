import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "argon2"
import { UserFactory } from "test/factories/make-user"
import request from 'supertest'

describe('Authenticate (E2E', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /login', async () => {
    await userFactory.makePrismaUser({
      email: 'fernandopessoa@exemple.com',
      password: await hash('123456'),
    })

    const response = await request(app.getHttpServer()).post('/login').send({
      email: 'fernandopessoa@exemple.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})