import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  public equals(id: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false
    }

    if (!(id instanceof UniqueEntityID)) {
      return false
    }

    if (id.toValue() === this.value) {
      return true
    }

    return false
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }
}
