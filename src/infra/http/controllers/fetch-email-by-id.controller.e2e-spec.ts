import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { EmailFactory } from "test/factories/make-email"
import { UserFactory } from "test/factories/make-user"
import request from 'supertest'
import { Test } from "@nestjs/testing"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe('Get email by id (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let emailFactory: EmailFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [
        UserFactory,
        EmailFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    emailFactory = moduleRef.get(EmailFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /email/:id', async () => {
    const sender = await userFactory.makePrismaUser({
      email: 'fernandopessoa@exemple.com',
    })

    const receiver = await userFactory.makePrismaUser({
      email: 'carlosdrummond@exemple.com',
    })

    const accessTokenSender = jwt.sign({ sub: sender.id.toString() })
    const accessTokenReceiver = jwt.sign({ sub: receiver.id.toString() })

    const email = await emailFactory.makePrismaEmail({
      senderId: sender.id,
      receiverId: receiver.id,
      title: 'Email 01',

    })

    const responseSender = await request(app.getHttpServer())
      .get(`/email/${email.id.toString()}`)
      .set('Authorization', `Bearer ${accessTokenSender}`)
      .send()

    expect(responseSender.statusCode).toBe(200)

    const emailBeforeReceiverRequest = await prisma.email.findUnique({
      where: { id: email.id.toString() },
    })
    expect(emailBeforeReceiverRequest?.isSeen).toBe(false)

    expect(responseSender.body).toEqual(
      expect.objectContaining({
        title: 'Email 01',
        enviado_para: receiver.email,
      }),
    )

    const responseReceiver = await request(app.getHttpServer())
      .get(`/email/${email.id.toString()}`)
      .set('Authorization', `Bearer ${accessTokenReceiver}`)
      .send()

    expect(responseReceiver.statusCode).toBe(200)

    const emailAfterReceiverRequest = await prisma.email.findUnique({
      where: { id: email.id.toString() },
    })
    expect(emailAfterReceiverRequest?.isSeen).toBe(true)

    expect(responseReceiver.body).toEqual(
      expect.objectContaining({
        title: 'Email 01',
        enviado_por: sender.email,
      }),
    )
  })
})