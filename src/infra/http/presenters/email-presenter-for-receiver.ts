import { EmailWithSenderReceiverNames } from "@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailDetailsPresenterForReceiver {

  static toHTTP(email: EmailWithSenderReceiverNames) {

    return {
      title: email.title,
      enviado_por: email.senderName,
      jaVisto: email.isSeen,
      email_id: email.id.toString(),
    }
  }
}