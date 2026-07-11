import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { PrismaEmailsRepository } from "./prisma/repositories/prisma-emails-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { EmailsRepository } from "@/domain/application/repositories/emails-repository";
import { CookiesRepository } from "@/domain/application/repositories/cookies-repostiory";
import { PrismaCookiesRepository } from "./prisma/repositories/prisma-coockies-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: EmailsRepository,
      useClass: PrismaEmailsRepository,
    },
    {
      provide: CookiesRepository,
      useClass: PrismaCookiesRepository,
    }
  ],
  exports: [
    PrismaService,
    UsersRepository,
    EmailsRepository,
    CookiesRepository,
  ],
})
export class DataBaseModule { }