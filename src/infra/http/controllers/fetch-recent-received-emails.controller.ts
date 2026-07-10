import { FetchRecentReceivedEmailsUseCase } from "@/domain/application/use-cases/fetch-recent-received-emails";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode } from "@nestjs/common";
import { EmailDetailsPresenterForReceiver } from "../presenters/email-presenter-for-receiver";

@Controller('/my-emails')
export class FetchRecenteReceivedEmailsController {
  constructor(
    private fetchRecentReceivedEmails: FetchRecentReceivedEmailsUseCase
  ) { }

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: TokenSchema) {
    const userId = user.sub

    const result = await this.fetchRecentReceivedEmails.execute({
      receiverId: userId
    })

    if (!result.value) {
      return null
    }

    const emails = result.value.emails
    //const emailsPresenter = emails.map(this.emailDetailsPresenter.toHTTP)

    return emails.map(email => EmailDetailsPresenterForReceiver.toHTTP(email))
  }
}