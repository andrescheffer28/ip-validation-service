import { HashComparer } from "@/domain/application/cryptography/hash-comparer"
import { HashGenerator } from "@/domain/application/cryptography/hash-generator"
import * as argon2 from "argon2"

export class Argon2Hasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plain)
  }
}