import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Email } from "@/domain/enterprise/entities/email";
import { Prisma, Email as PrismaEmail } from "@prisma/client";

export class PrismaEmailMapper {
  static toDomain(raw: PrismaEmail): Email {
    return Email.create({
      title: raw.title,
      content: raw.content,
      isSeen: raw.isSeen,
      createdAt: raw.data,
      senderId: new UniqueEntityID(raw.senderId),
      receiverId: new UniqueEntityID(raw.receiverId),
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(email: Email): Prisma.EmailUncheckedCreateInput {
    return {
      id: email.id.toString(),
      title: email.title,
      content: email.content,
      isSeen: email.isSeen,
      data: email.createdAt,
      senderId: email.senderId.toString(),
      receiverId: email.receiverId.toString(),
    }
  }
}