import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from 'supertest'
import { EmailFactory } from "test/factories/make-email"
import { UserFactory } from "test/factories/make-user"

describe('Fetch recent received emails (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let emailFactory: EmailFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory, EmailFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    emailFactory = moduleRef.get(EmailFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /my-emails', async () => {
    const sender = await userFactory.makePrismaUser({
      name: 'Fernando Pessoa',
    })
    const receiver = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: receiver.id.toString() })

    await Promise.all([
      emailFactory.makePrismaEmail({
        senderId: sender.id,
        receiverId: receiver.id,
        title: 'Question 01',
      }),
      emailFactory.makePrismaEmail({
        senderId: sender.id,
        receiverId: receiver.id,
        title: 'Question 02',
      }),
      emailFactory.makePrismaEmail({
        senderId: sender.id,
        receiverId: receiver.id,
        title: 'Question 03',
      })
    ])

    const response = await request(app.getHttpServer())
      .get('/my-emails')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Question 01',
        enviado_por: 'Fernando Pessoa',
      }),
      expect.objectContaining({
        title: 'Question 02',
        enviado_por: 'Fernando Pessoa',
      }),
      expect.objectContaining({
        title: 'Question 03',
        enviado_por: 'Fernando Pessoa',
      }),
    ]))
  })
})