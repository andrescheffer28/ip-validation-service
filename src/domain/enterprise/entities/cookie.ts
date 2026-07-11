import { Entity } from "@/core/entities/entity"
import { Optional } from "@/core/entities/types/optional"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface CoockieProps {
  userIP: string
  userID: UniqueEntityID
  token: string
  createdAt: Date
  country: string | null
  city: string | null
}

export class Coockie extends Entity<CoockieProps> {
  get userIP(){
    return this.props.userIP
  }

  get userID(){
    return this.props.userID
  }

  get token(){
    return this.props.token
  }

  get createdAt() {
    return this.props.createdAt
  }

  get country(){
    return this.props.country
  }

  get city(){
    return this.props.city
  }

  isSameIP(currentUserIP: string): boolean{
    return this.props.userIP === currentUserIP
  }

  isLocationValid(currentCountry: string | null, currentCity: string | null): boolean{
    
    const isSameCountry = this.props.country === currentCountry
    const isSameCity = this.props.city === currentCity

    return isSameCountry && isSameCity
  }

  static create(
    props: Optional<CoockieProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const coockie = new Coockie(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    return coockie
  }
}