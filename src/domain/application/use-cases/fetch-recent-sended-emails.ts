import { Either, right } from '@/core/either'
import { EmailsRepository } from '../repositories/emails-repository'
import { EmailWithSenderReceiverNames } from '@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names'
import { Injectable } from '@nestjs/common'

interface FetchRecentSendedEmailsUseCaseRequest {
  senderId: string
}

type FetchRecentSendedEmailsUseCaseResponse = Either<
  null,
  {
    emails: EmailWithSenderReceiverNames[]
  }
>

@Injectable()
export class FetchRecentSendedEmailsUseCase {
  constructor(private emailsRepository: EmailsRepository) { }

  async execute({
    senderId,
  }: FetchRecentSendedEmailsUseCaseRequest): Promise<FetchRecentSendedEmailsUseCaseResponse> {
    const emails = await this.emailsRepository.findManyBySenderId(senderId)

    return right({
      emails,
    })
  }
}
