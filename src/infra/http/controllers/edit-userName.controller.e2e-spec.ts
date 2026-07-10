import { AppModule } from "@/infra/app.module"
import { DataBaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from 'supertest'
import { UserFactory } from "test/factories/make-user"

describe('Edit User Name (E2E)', () => {
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

  test('[PATCH] /my-name', async () => {
    const user = await userFactory.makePrismaUser(
      {
        profileImage: 'Old name',
      }
    )

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/my-name')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userName: 'Carlos Drummond',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDatabase?.name).toBe('Carlos Drummond')
  })
})