import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/hasher'
import { HashComparer } from '../../data/protocols/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword)
    return new Promise(resolve => resolve(isValid))
  }
}
