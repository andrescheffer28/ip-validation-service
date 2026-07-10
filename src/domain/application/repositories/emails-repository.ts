import { Email } from '@/domain/enterprise/entities/email'
import { EmailWithSenderReceiverNames } from '@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names';

export abstract class EmailsRepository {
  abstract findById(id: string): Promise<Email | null>
  abstract findDetailsById(id: string): Promise<EmailWithSenderReceiverNames | null>
  abstract findManyByReceiverId(receiverId: string): Promise<EmailWithSenderReceiverNames[]>
  abstract findManyBySenderId(senderId: string): Promise<EmailWithSenderReceiverNames[]>
  abstract create(email: Email): Promise<void>
  abstract save(email: Email): Promise<void>
  abstract delete(email: Email): Promise<void>
}
