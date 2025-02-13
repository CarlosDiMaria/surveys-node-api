import { Decrypter } from '../../data/protocols/decrypter'
import { Encrypter } from '../../data/protocols/encrypter'
import jwt, { JwtPayload } from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret

  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<string | JwtPayload> {
    const value = jwt.verify(token, this.secret)
    return Promise.resolve(value)
  }
}
