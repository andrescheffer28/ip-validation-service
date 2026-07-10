import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Email } from '@/domain/enterprise/entities/email'
import { EmailsRepository } from '../repositories/emails-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface SendEmailUseCaseRequest {
  senderId: string
  receiverEmail: string
  title: string
  content: string
}

type SendEmailUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    email: Email
  }
>

@Injectable()
export class SendEmailUseCase {
  constructor(
    private emailsRepository: EmailsRepository,
    private usersRepository: UsersRepository
  ) { }

  async execute({
    title,
    content,
    senderId,
    receiverEmail,
  }: SendEmailUseCaseRequest): Promise<SendEmailUseCaseResponse> {
    const receiverExists = await this.usersRepository.findByEmail(receiverEmail)

    if (!receiverExists) {
      return left(new ResourceNotFoundError())
    }

    const email = Email.create({
      title,
      content,
      senderId: new UniqueEntityID(senderId),
      receiverId: new UniqueEntityID(receiverExists.id.toString()),
      isSeen: false,
    })

    await this.emailsRepository.create(email)

    return right({
      email,
    })
  }
}
