import { Coockie } from "@/domain/enterprise/entities/cookie";

export abstract class CoockiesRepository {
  abstract findByUserID(id: string): Promise<Coockie[] | null>
  abstract create(coockie: Coockie): Promise<void>
  abstract delete(coockie: Coockie): Promise<void>
}