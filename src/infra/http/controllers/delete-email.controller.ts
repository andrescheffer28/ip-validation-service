import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { DeleteEmailUseCase } from "@/domain/application/use-cases/delete-email";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, ForbiddenException, HttpCode, NotFoundException, Param, UnauthorizedException } from "@nestjs/common";

@Controller('/email/:id')
export class DeleteEmailController {
  constructor(private deleteEmail: DeleteEmailUseCase) { }

  @Delete()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: TokenSchema,
    @Param('id') emailId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteEmail.execute({
      senderId: userId,
      emailId,
    })

    if (result.isLeft()) {

      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      if (error instanceof NotAllowedError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}