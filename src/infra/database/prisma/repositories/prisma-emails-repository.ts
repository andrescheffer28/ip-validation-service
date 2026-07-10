import { EmailsRepository } from "@/domain/application/repositories/emails-repository";
import { Email } from "@/domain/enterprise/entities/email";
import { Injectable } from "@nestjs/common";
import { PrismaEmailMapper } from "../mappers/prisma-email-mapper";
import { PrismaService } from "../prisma.service";
import { EmailWithSenderReceiverNames } from "@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

@Injectable()
export class PrismaEmailsRepository implements EmailsRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<Email | null> {
    const email = await this.prisma.email.findUnique({
      where: {
        id,
      }
    })

    if (!email) {
      return null
    }

    return PrismaEmailMapper.toDomain(email)
  }

  async findDetailsById(id: string): Promise<EmailWithSenderReceiverNames | null> {
    const email = await this.prisma.email.findUnique({
      where: { id },
      include: { sender: true, receiver: true },
    })

    if (!email) {
      return null
    }

    return EmailWithSenderReceiverNames.create({
      emailId: new UniqueEntityID(email.id),
      title: email.title,
      content: email.content,
      createdAt: email.data,
      isSeen: email.isSeen,
      senderId: new UniqueEntityID(email.senderId),
      senderName: email.sender.name,
      senderEmail: email.sender.email,
      receiverId: new UniqueEntityID(email.receiverId),
      receiverName: email.receiver.name,
      receiverEmail: email.receiver.email,
    })
  }

  async findManyByReceiverId(receiverId: string): Promise<EmailWithSenderReceiverNames[]> {
    const emails = await this.prisma.email.findMany({
      where: { receiverId },
      include: { sender: true, receiver: true },
      orderBy: { data: 'desc' },
    })

    return emails.map((email) => EmailWithSenderReceiverNames.create({
      emailId: new UniqueEntityID(email.id),
      title: email.title,
      content: email.content,
      createdAt: email.data,
      isSeen: email.isSeen,
      senderId: new UniqueEntityID(email.senderId),
      senderName: email.sender.name,
      senderEmail: email.sender.email,
      receiverId: new UniqueEntityID(email.receiverId),
      receiverName: email.receiver.name,
      receiverEmail: email.receiver.email,
    }))
  }

  async findManyBySenderId(senderId: string): Promise<EmailWithSenderReceiverNames[]> {
    const emails = await this.prisma.email.findMany({
      where: { senderId },
      include: { sender: true, receiver: true },
      orderBy: { data: 'desc' },
    })

    return emails.map((email) => EmailWithSenderReceiverNames.create({
      emailId: new UniqueEntityID(email.id),
      title: email.title,
      content: email.content,
      createdAt: email.data,
      isSeen: email.isSeen,
      senderId: new UniqueEntityID(email.senderId),
      senderName: email.sender.name,
      senderEmail: email.sender.email,
      receiverId: new UniqueEntityID(email.receiverId),
      receiverName: email.receiver.name,
      receiverEmail: email.receiver.email,
    }))
  }

  async create(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email)

    await this.prisma.email.create({
      data,
    })
  }

  async save(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email)

    await this.prisma.email.update({
      where: {
        id: email.id.toString(),
      },
      data,
    })
  }

  async delete(email: Email): Promise<void> {
    const data = PrismaEmailMapper.toPrisma(email)

    await this.prisma.email.delete({
      where: {
        id: data.id,
      }
    })
  }

}