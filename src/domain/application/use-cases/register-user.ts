import { Either, left, right } from '@/core/either'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@/domain/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
  profileImage?: string
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) { }

  async execute({
    name,
    email,
    password,
    profileImage,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
