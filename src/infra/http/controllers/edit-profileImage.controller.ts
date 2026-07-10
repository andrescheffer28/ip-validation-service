import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Patch, UnauthorizedException } from "@nestjs/common";
import { UpdateProfileImageUseCase } from "@/domain/application/use-cases/update-profile-image";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { TokenSchema } from "@/infra/auth/jwt.strategy";
import { WrongCredentialsError } from "@/domain/application/use-cases/errors/wrong-credentials-error";

const editProfileImageBodySchema = z.object({
  profileImage: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editProfileImageBodySchema)

type EditProfileImageBodySchema = z.infer<typeof editProfileImageBodySchema>

@Controller('/my-image')
export class EditProfileImageController {
  constructor(private editProfileImage: UpdateProfileImageUseCase) { }

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditProfileImageBodySchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const { profileImage } = body
    const userId = user.sub
    const result = await this.editProfileImage.execute({
      userId,
      profileImage,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}