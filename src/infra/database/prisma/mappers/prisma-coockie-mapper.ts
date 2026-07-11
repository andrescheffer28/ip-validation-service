import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Cookie } from "@/domain/enterprise/entities/cookie";
import { Prisma, Cookie as PrismaCookie } from "@prisma/client";

export class PrismaCookieMapper {
  static toDomain(raw: PrismaCookie): Cookie {

    return Cookie.create({
        userIP: raw.userIP,
        userID: new UniqueEntityID(raw.userId),
        createdAt: raw.createdAt,
        country: raw.country,
        city: raw.city,
      }
    )
  }

  static toPrisma(cookie: Cookie): Prisma.CookieUncheckedCreateInput {
    return {
      userId: cookie.userID.toString(),
      userIP: cookie.userIP,
      createdAt: cookie.createdAt,
      country: cookie.country,
      city: cookie.city
    }
  }
}