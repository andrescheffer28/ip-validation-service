import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode } from "@nestjs/common";
import { EmailDetailsPresenterForReceiver } from "../presenters/email-presenter-for-receiver";
import { FetchRecentSendedEmailsUseCase } from "@/domain/application/use-cases/fetch-recent-sended-emails";
import { EmailDetailsPresenterForSender } from "../presenters/email-presenter-for-sender";

@Controller('/sent-emails')
export class FetchRecenteSendedEmailsController {
  constructor(
    private fetchRecentSendedEmails: FetchRecentSendedEmailsUseCase
  ) { }

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: TokenSchema) {
    const userId = user.sub

    const result = await this.fetchRecentSendedEmails.execute({
      senderId: userId
    })

    if (!result.value) {
      return null
    }

    const emails = result.value.emails
    //const emailsPresenter = emails.map(this.emailDetailsPresenter.toHTTP)

    return emails.map(email => EmailDetailsPresenterForSender.toHTTP(email))
  }
}