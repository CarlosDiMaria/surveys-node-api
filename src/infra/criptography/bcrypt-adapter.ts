import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/hasher'

export class BcryptAdapter implements Hasher {
  salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
