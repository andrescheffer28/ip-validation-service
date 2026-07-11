import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { CoockiesRepository } from "../../repositories/cookies-repostiory"
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
    private coockiesRepository: CoockiesRepository,
    private geolocationGateway: GeolocationGateway
  ) { }
  
  async execute({
    userID,
    currentUserIP
  }: IPValidatorUseCaseRequest): Promise<IPValidatorUseCaseResponse> {
    const coockies = await this.coockiesRepository.findByUserID(userID)

    if(!coockies || coockies.length === 0){
      return left(new ResourceNotFoundError())
    }

    const activeCookie = coockies.reduce((mostRecent, current) => {
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