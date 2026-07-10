import { Either, left, right } from '@/core/either'
import { EmailsRepository } from '../repositories/emails-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { EmailWithSenderReceiverNames } from '@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names'

interface FetchEmailByIdUseCaseRequest {
  userId: string
  emailId: string
}

type FetchEmailByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    email: EmailWithSenderReceiverNames
  }
>

@Injectable()
export class FetchEmailDetailsByIdUseCase {
  constructor(private emailsRepository: EmailsRepository) { }

  async execute({
    userId,
    emailId,
  }: FetchEmailByIdUseCaseRequest): Promise<FetchEmailByIdUseCaseResponse> {
    const email = await this.emailsRepository.findDetailsById(emailId)

    if (!email) {
      return left(new ResourceNotFoundError())
    }

    if (
      email.senderId.toString() !== userId &&
      email.receiverId.toString() !== userId
    ) {
      return left(new NotAllowedError())
    }

    return right({
      email,
    })
  }
}