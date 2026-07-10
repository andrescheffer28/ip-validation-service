import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface UpdateUserNameUseCaseRequest {
  userId: string
  name: string
}

type UpdateUserNameUseCaseResponse = Either<
  WrongCredentialsError,
  {
    user: User
  }
>

@Injectable()
export class UpdateUserNameUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    name,
  }: UpdateUserNameUseCaseRequest): Promise<UpdateUserNameUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    user.name = name

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
