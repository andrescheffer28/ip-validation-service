import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { UsersRepository } from '../repositories/users-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { CoockiesRepository } from '../repositories/cookies-repostiory'
import { Coockie } from '@/domain/enterprise/entities/cookie'
import { GeolocationGateway } from '../providers/geolocation-gateway'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
  userIP: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private geolocationGatewayey: GeolocationGateway,
    private coockiesRepository: CoockiesRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) { }

  async execute({
    email,
    password,
    userIP,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    
    if (!user) {
      return left(new WrongCredentialsError())
    }
    
    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password
    )
    
    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const location = await this.geolocationGatewayey.locate(userIP)
    
    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    const coockie = Coockie.create({
      userID: user.id,
      userIP: userIP,
      token: accessToken,
      country: location? location.country : null,
      city: location? location.city : null,
    })

    await this.coockiesRepository.create(coockie)

    return right({
      accessToken,
    })
  }
}
