import { Public } from "@/infra/auth/public";
import { BadRequestException, Body, Controller, HttpCode, Post, Req, UnauthorizedException, UsePipes } from "@nestjs/common";
import z, { email } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import { WrongCredentialsError } from "@/domain/application/use-cases/errors/wrong-credentials-error";
import type { Request } from "express";

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/login')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) { }

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
    @Req() req: Request
  ) {

    const userIp = req.ip
    const { email, password } = body
    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error)
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}