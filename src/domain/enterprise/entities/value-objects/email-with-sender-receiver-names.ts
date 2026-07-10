import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Entity } from "@/core/entities/entity";

export interface EmailWithSenderReceiverNamesProps {
  emailId: UniqueEntityID,
  title: string,
  content: string,
  createdAt: Date,
  isSeen: boolean,
  senderId: UniqueEntityID,
  senderName: string,
  senderEmail: string,
  receiverId: UniqueEntityID,
  receiverName: string,
  receiverEmail: string,
}

export class EmailWithSenderReceiverNames extends Entity<EmailWithSenderReceiverNamesProps> {
  get emailId() {
    return this.props.emailId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get isSeen() {
    return this.props.isSeen
  }

  get senderId() {
    return this.props.senderId
  }

  get senderName() {
    return this.props.senderName
  }

  get senderEmail() {
    return this.props.senderEmail
  }

  get receiverId() {
    return this.props.receiverId
  }

  get receiverName() {
    return this.props.receiverName
  }

  get receiverEmail() {
    return this.props.receiverEmail
  }

  static create(props: EmailWithSenderReceiverNamesProps) {
    const emailWithSenderReceiverNames = new EmailWithSenderReceiverNames(props, props.emailId)
    return emailWithSenderReceiverNames
  }
}