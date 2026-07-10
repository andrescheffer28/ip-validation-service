import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException } from "@nestjs/common";
import { SendEmailUseCase } from "@/domain/application/use-cases/send-email";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";

const sendEmailBodySchema = z.object({
  title: z.string().nonempty(),
  emailDeDestinatario: z.email(),
  content: z.string(),
})

type SendEmailBodySchema = z.infer<typeof sendEmailBodySchema>

@Controller('/email')
export class SendEmailController {
  constructor(private sendEmail: SendEmailUseCase) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body() body: SendEmailBodySchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const { title, emailDeDestinatario, content } = body
    const senderId = user.sub

    const result = await this.sendEmail.execute({
      title,
      content,
      senderId,
      receiverEmail: emailDeDestinatario,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}