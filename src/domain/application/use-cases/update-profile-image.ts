import { Either, left, right } from '@/core/either'
import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

interface UpdateProfileImageUseCaseRequest {
  userId: string
  profileImage: string
}

type UpdateProfileImageUseCaseResponse = Either<
  WrongCredentialsError,
  {
    user: User
  }
>

@Injectable()
export class UpdateProfileImageUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    profileImage,
  }: UpdateProfileImageUseCaseRequest): Promise<UpdateProfileImageUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    user.profileImage = profileImage

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
