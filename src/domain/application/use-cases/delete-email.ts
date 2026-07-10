import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { EmailsRepository } from '../repositories/emails-repository'
import { Injectable } from '@nestjs/common'

interface DeleteEmailUseCaseRequest {
  senderId: string
  emailId: string
}

type DeleteEmailUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteEmailUseCase {
  constructor(private emailsRepository: EmailsRepository) { }

  async execute({
    senderId,
    emailId,
  }: DeleteEmailUseCaseRequest): Promise<DeleteEmailUseCaseResponse> {
    const email = await this.emailsRepository.findById(emailId)

    if (!email) {
      return left(new ResourceNotFoundError())
    }

    if (email.isSeen) {
      return left(new NotAllowedError())
    }

    if (email.senderId.toString() !== senderId) {
      return left(new NotAllowedError())
    }

    await this.emailsRepository.delete(email)

    return right(null)
  }
}
