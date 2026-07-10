import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'

export const createAccountSchema = z
  .object({
    name: z.string().nonempty(),
    profileImage: z.string().optional(),
    email: z.email(),
    password: z.string().min(6),
  })

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>

@Controller('/user')
@Public()
export class CreateAccountController {
  constructor(
    private createUser: RegisterUserUseCase,
  ) { }

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, profileImage, email, password } = body
    const result = await this.createUser.execute({
      name,
      email,
      profileImage: profileImage,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw new BadRequestException(error);
    }
  }
}
