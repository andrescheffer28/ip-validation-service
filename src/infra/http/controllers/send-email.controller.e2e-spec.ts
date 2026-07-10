import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from "test/factories/make-user"

describe('Send Email (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /email', async () => {
    const user = await userFactory.makePrismaUser(
      {
        email: "carlosdrummond@exemple.com",
      }
    )

    await userFactory.makePrismaUser(
      {
        email: "claricelispector@exemple.com"
      }
    )

    const access_token = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/email')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'Carta',
        content: 'Ler ou reler voce eh sempre uma operacao feliz',
        emailDeDestinatario: 'claricelispector@exemple.com',
      })

    expect(response.statusCode).toBe(201)

    const emailOnDataBase = await prisma.email.findFirst({
      where: {
        title: 'Carta',
      },
    })

    expect(emailOnDataBase?.senderId).toBe(user.id.toString())
  })
})
