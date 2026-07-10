import { Encrypter } from "@/domain/application/cryptography/encrypter";
import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter";
import { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/application/cryptography/hash-generator";
import { Argon2Hasher } from "./argo2-hasher";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: Argon2Hasher,
    },
    {
      provide: HashGenerator,
      useClass: Argon2Hasher,
    }
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator,
  ]
})
export class CryptographyModule { }
