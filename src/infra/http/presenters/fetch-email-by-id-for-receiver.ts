import { Email } from "@/domain/enterprise/entities/email";
import { EmailWithSenderReceiverNames } from "@/domain/enterprise/entities/value-objects/email-with-sender-receiver-names";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FetchEmailDetailsPresenterForReceiver {

  static toHTTP(email: EmailWithSenderReceiverNames) {

    return {
      title: email.title,
      content: email.content,
      enviado_por: email.senderEmail,
    }
  }
}