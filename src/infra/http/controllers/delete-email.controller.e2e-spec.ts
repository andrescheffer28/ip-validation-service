import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { DataBaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from 'supertest'
import { EmailFactory } from "test/factories/make-email"
import { UserFactory } from "test/factories/make-user"

describe('Delete Email (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let emailFactory: EmailFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [UserFactory, EmailFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    emailFactory = moduleRef.get(EmailFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /email/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const email = await emailFactory.makePrismaEmail({
      senderId: user.id,
      receiverId: user.id,
    })

    const emailId = email.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/email/${emailId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    const emailOnDatabase = await prisma.email.findUnique({
      where: {
        id: emailId,
      },
    })

    expect(emailOnDatabase).toBeNull()
  })
})