import { Either, left, right } from '@/core/either'
import { Email } from '@/domain/enterprise/entities/email'
import { EmailsRepository } from '../repositories/emails-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface FetchEmailByIdUseCaseRequest {
  userId: string
  emailId: string
}

type FetchEmailByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    email: Email
  }
>

@Injectable()
export class FetchEmailByIdUseCase {
  constructor(private emailsRepository: EmailsRepository) { }

  async execute({
    userId,
    emailId,
  }: FetchEmailByIdUseCaseRequest): Promise<FetchEmailByIdUseCaseResponse> {
    const email = await this.emailsRepository.findById(emailId)

    if (!email) {
      return left(new ResourceNotFoundError())
    }

    if (
      email.senderId.toString() !== userId &&
      email.receiverId.toString() !== userId
    ) {
      return left(new NotAllowedError())
    }

    if (email.receiverId.toString() === userId) {
      email.isSeen = true

      await this.emailsRepository.save(email)
    }

    return right({
      email,
    })
  }
}
