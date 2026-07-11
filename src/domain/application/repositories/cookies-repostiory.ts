import { Cookie } from "@/domain/enterprise/entities/cookie";

export abstract class CookiesRepository {
  abstract findByUserID(id: string): Promise<Cookie[] | null>
  abstract create(cookie: Cookie): Promise<void>
  abstract delete(cookie: Cookie): Promise<void>
}