import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/entities/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface EmailProps {
  title: string
  createdAt: Date
  content: string
  isSeen: boolean
  senderId: UniqueEntityID
  receiverId: UniqueEntityID
}

export class Email extends Entity<EmailProps> {
  get title() {
    return this.props.title
  }

  get createdAt() {
    return this.props.createdAt
  }

  get content() {
    return this.props.content
  }

  get isSeen() {
    return this.props.isSeen
  }

  set isSeen(isSeen: boolean) {
    this.props.isSeen = isSeen
  }

  get senderId() {
    return this.props.senderId
  }

  get receiverId() {
    return this.props.receiverId
  }

  static create(
    props: Optional<EmailProps, 'createdAt' | 'isSeen'>,
    id?: UniqueEntityID
  ) {
    const email = new Email(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        isSeen: false,
      },
      id
    )
    return email
  }
}
