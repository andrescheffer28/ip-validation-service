import { Either, right } from '@/core/either'
import { EmailsRepository } from '../repositories/emails-repository'
import { EmailWithSenderReceiverNames } from '@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names'
import { Injectable } from '@nestjs/common'

interface FetchRecentReceivedEmailsUseCaseRequest {
  receiverId: string
}

type FetchRecentReceivedEmailsUseCaseResponse = Either<
  null,
  {
    emails: EmailWithSenderReceiverNames[]
  }
>

@Injectable()
export class FetchRecentReceivedEmailsUseCase {
  constructor(private emailsRepository: EmailsRepository) { }

  async execute({
    receiverId,
  }: FetchRecentReceivedEmailsUseCaseRequest): Promise<FetchRecentReceivedEmailsUseCaseResponse> {
    const emails = await this.emailsRepository.findManyByReceiverId(receiverId)

    return right({
      emails,
    })
  }
}
