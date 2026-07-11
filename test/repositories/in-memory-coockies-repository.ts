import { CookiesRepository } from "@/domain/application/repositories/cookies-repostiory";
import { Cookie } from "@/domain/enterprise/entities/cookie";

export class InMemoryCookiesRepository implements CookiesRepository {
  public items: Cookie[] = []

  async findByUserID(id: string): Promise<Cookie[] | null> {
    const cookie = this.items.filter(item => item.userID.toString() == id)

    if(!cookie){
      return null
    }

    return cookie
  }

  async create(cookie: Cookie): Promise<void> {
    this.items.push(cookie)
  }

  async delete(cookie: Cookie): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === cookie.id.toString())
    this.items.splice(itemIndex, 1)
  }
  
}