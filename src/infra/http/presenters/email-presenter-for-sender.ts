import { EmailWithSenderReceiverNames } from "@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailDetailsPresenterForSender {

  static toHTTP(email: EmailWithSenderReceiverNames) {

    return {
      title: email.title,
      enviado_para: email.receiverName,
      jaVisto: email.isSeen,
      email_id: email.id.toString(),
    }
  }
}