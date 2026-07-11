import { CoockiesRepository } from "@/domain/application/repositories/cookies-repostiory";
import { Coockie } from "@/domain/enterprise/entities/cookie";

export class InMemoryCoockiesRepository implements CoockiesRepository {
  public items: Coockie[] = []

  async findByUserID(id: string): Promise<Coockie[] | null> {
    const coockie = this.items.filter(item => item.userID.toString() == id)

    if(!coockie){
      return null
    }

    return coockie
  }

  async create(coockie: Coockie): Promise<void> {
    this.items.push(coockie)
  }

  async delete(coockie: Coockie): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === coockie.id.toString())
    this.items.splice(itemIndex, 1)
  }
  
}