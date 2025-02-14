import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/load-account-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly descrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
    const accessToken = await this.descrypter.decrypt(token)
    if (accessToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
      if (account) {
        return Promise.resolve(account)
      }
    }
    return Promise.resolve(null)
  }
}
