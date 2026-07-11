import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { CookiesRepository } from "../../repositories/cookies-repostiory"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import { GeolocationData, GeolocationGateway } from "../../providers/geolocation-gateway"

interface IPValidatorUseCaseRequest {
  userID: string,
  currentUserIP: string,
}

type IPValidatorUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    isValid: boolean
    reason?: string
    location: GeolocationData | null
  }
>

@Injectable()
export class IPValidatorUseCase {
  constructor(
    private cookiesRepository: CookiesRepository,
    private geolocationGateway: GeolocationGateway
  ) { }
  
  async execute({
    userID,
    currentUserIP
  }: IPValidatorUseCaseRequest): Promise<IPValidatorUseCaseResponse> {
    const cookies = await this.cookiesRepository.findByUserID(userID)

    if(!cookies || cookies.length === 0){
      return left(new ResourceNotFoundError())
    }

    const activeCookie = cookies.reduce((mostRecent, current) => {
      return current.createdAt.getTime() > mostRecent.createdAt.getTime()
      ? current
      : mostRecent
    })

    const isSameIP = activeCookie.isSameIP(currentUserIP)

    let isSameLocation: boolean
    isSameLocation = false

    let location: GeolocationData | null
    location = null
    if(!isSameIP){
      location = await this.geolocationGateway.locate(currentUserIP)
      isSameLocation = activeCookie.isLocationValid(
        location? location.country : null,
        location? location.city : null
      ) 
    }

    return right(
      {
        isValid: isSameIP || isSameLocation,
        location
      }
    )
  }
}