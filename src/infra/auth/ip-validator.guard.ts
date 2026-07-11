import { IPValidatorUseCase } from "@/domain/application/use-cases/ip-validator/ip-validator";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public";
import { TokenSchema } from "./jwt.strategy";

@Injectable()
export class IPValidatorGuard implements CanActivate {
  constructor(
    private ipValidatorUseCase: IPValidatorUseCase,
    private reflector: Reflector
  ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
      ])

      if(isPublic){
        return true
      }

      const request = context.switchToHttp().getRequest()

      const user = request.user as TokenSchema

      const ip = request.ip

      if(!user){
        return false
      }

      const isValidIP = await this.ipValidatorUseCase.execute({
        userID: user.sub,
        currentUserIP: ip
      })

      if(!isValidIP){
        throw new ForbiddenException('Acesso negado: IP não reconhecido para esta sessão.')
      }

      return true
    }
}