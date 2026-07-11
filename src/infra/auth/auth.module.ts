import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Env } from "../env/env";
import { IPValidatorGuard } from "./ip-validator.guard";
import { IPValidatorUseCase } from "@/domain/application/use-cases/ip-validator/ip-validator";
import { DataBaseModule } from "../database/database.module";
import { GeolocationModule } from "../geolocation-gateway/geolocation.module";

@Module({
  imports: [
    PassportModule,
    DataBaseModule,
    GeolocationModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
        return {
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '2h',
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    })
  ],
  providers: [
    JwtStrategy,
    IPValidatorUseCase,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IPValidatorGuard
    }
  ]
})
export class AuthModule { }