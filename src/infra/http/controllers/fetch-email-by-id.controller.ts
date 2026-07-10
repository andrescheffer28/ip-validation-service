import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";
import { FetchEmailByIdUseCase } from "@/domain/application/use-cases/fetch-email-by-id";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, NotFoundException, Param, UnauthorizedException } from "@nestjs/common";
import { FetchEmailDetailsByIdUseCase } from "@/domain/application/use-cases/fetch-email-details-by-id";
import { FetchEmailDetailsPresenterForSender } from "../presenters/fetch-email-by-id-for-sender";
import { FetchEmailDetailsPresenterForReceiver } from "../presenters/fetch-email-by-id-for-receiver";

@Controller('/email/:id')
export class FetchEmailByIdController {
  constructor(
    private fetchEmailById: FetchEmailByIdUseCase,
    private fetchEmailDetailsById: FetchEmailDetailsByIdUseCase,
  ) { }

  @Get()
  async handle(
    @CurrentUser() user: TokenSchema,
    @Param('id') emailId: string
  ) {
    const userId = user.sub

    const result = await this.fetchEmailById.execute({
      userId,
      emailId,
    })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        return new NotFoundException()
      }

      if (error instanceof NotAllowedError) {
        return new UnauthorizedException()
      }

      return new BadRequestException()
    }

    const emailForPresenter = await this.fetchEmailDetailsById.execute({
      userId,
      emailId,
    })

    if (emailForPresenter.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        return new NotFoundException()
      }

      if (error instanceof NotAllowedError) {
        return new UnauthorizedException()
      }

      return new BadRequestException()
    }

    const email = emailForPresenter.value.email

    if (result.value.email.senderId.toString() === userId) {
      return FetchEmailDetailsPresenterForSender.toHTTP(email)
    }

    return FetchEmailDetailsPresenterForReceiver.toHTTP(email)
  }
}