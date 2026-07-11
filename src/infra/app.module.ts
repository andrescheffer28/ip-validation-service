import { Module } from '@nestjs/common'
import { HTTPModule } from './http/http.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { CustomThrottlerGuard } from './auth/custom-throttler.guard'
import { EnvModule } from './env/env.module'
import { envSchema } from './env/env'
import { GeolocationModule } from './geolocation-gateway/geolocation.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000, // Janela de tempo de 1 minuto
      limit: 100, // Máximo de 100 requisições por IP nesse tempo
    }]),
    EnvModule,
    HTTPModule,
    AuthModule,
    GeolocationModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ]
})
export class AppModule { }
