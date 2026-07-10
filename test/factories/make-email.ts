import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email, EmailProps } from '@/domain/enterprise/entities/email'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaEmailMapper } from '@/infra/database/prisma/mappers/prisma-email-mapper'

export function makeEmail(
  override: Partial<EmailProps> = {},
  id?: UniqueEntityID
) {
  const email = Email.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      receiverId: new UniqueEntityID(),
      senderId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return email
}

@Injectable()
export class EmailFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaEmail(
    data: Partial<EmailProps> = {},
  ): Promise<Email> {
    const email = makeEmail(data)

    await this.prisma.email.create({
      data: PrismaEmailMapper.toPrisma(email),
    })

    return email
  }
}
