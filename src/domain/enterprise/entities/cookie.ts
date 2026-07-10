import { Entity } from "@/core/entities/entity"
import { Optional } from "@/core/entities/types/optional"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface CoockieProps {
  _userIP: string
  userID: UniqueEntityID
  token: string
  createdAt: Date
}

export class Coockie extends Entity<CoockieProps> {
  get userID(){
    return this.props.userID
  }

  get token(){
    return this.props.token
  }

  get createdAt() {
    return this.props.createdAt
  }

  ComparaIP(userIp: string): Boolean{
    return (this.props._userIP === userIp)
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