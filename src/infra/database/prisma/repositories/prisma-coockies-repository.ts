import { CookiesRepository } from "@/domain/application/repositories/cookies-repostiory";
import { Cookie } from "@/domain/enterprise/entities/cookie";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaCookieMapper } from "../mappers/prisma-coockie-mapper";

@Injectable()
export class PrismaCookiesRepository implements CookiesRepository {
  constructor(private prisma: PrismaService) { }

  async findByUserID(id: string): Promise<Cookie[] | null> {
    const cookies = await this.prisma.cookie.findMany({
      where: {
        userId: id,
      }
    })

    if (!cookies) {
      return null
    }
    
    return cookies.map((cookie) => PrismaCookieMapper.toDomain(cookie))
  }

  async create(cookie: Cookie): Promise<void> {
    const data = PrismaCookieMapper.toPrisma(cookie)

      await this.prisma.cookie.create({
        data
      })
  }

  async delete(cookie: Cookie): Promise<void> {
    const data = PrismaCookieMapper.toPrisma(cookie)
    
    await this.prisma.cookie.deleteMany({
      where: {
        userIP: data.id,
      }
    })
  }

}