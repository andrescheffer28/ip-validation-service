import { Module } from '@nestjs/common'
import { HTTPModule } from './http/http.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { CustomThrottlerGuard } from './auth/custom-throttler.guard'

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

    HTTPModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ]
})
export class AppModule { }
