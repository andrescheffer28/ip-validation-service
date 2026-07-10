import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UserProps {
  name: string
  email: string
  password: string
  profileImage?: string | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  get profileImage() {
    return this.props.profileImage
  }

  set profileImage(profileImage: string | undefined | null) {
    this.props.profileImage = profileImage
  }

  get password() {
    return this.props.password
  }

  static create(
    props: Optional<UserProps, 'profileImage'>,
    id?: UniqueEntityID
  ) {
    const user = new User(
      {
        ...props,
        profileImage: props.profileImage ?? undefined,
      },
      id
    )

    return user
  }
}
