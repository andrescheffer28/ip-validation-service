import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { ConfigService } from '@nestjs/config';
import { Env } from '@/infra/env';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService<Env, true>) {

    const databaseurl = configService.get('DATABASE_URL', {infer: true})


    const url = new URL(databaseurl)
    const schema = url.searchParams.get('schema') || 'public'

    const pool = new Pool({ connectionString: databaseurl });

    const adapter = new PrismaPg(pool, { schema });

    console.log('DATABASE_URL:', databaseurl)

    super({
      adapter,
      log: ['warn', 'error'],
    })
  }
  onModuleInit() {
    return this.$connect()
  }
  onModuleDestroy() {
    return this.$disconnect()
  }
}
