import { Authentication } from '../../../domain/usecases/authentication'
import { Encrypter } from '../../protocols/encrypter'
import { HashComparer } from '../../protocols/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-repository'

import { UpdateAccessTokenRepository } from '../../protocols/update-access-token-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (email: string, password: string): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null
    const { id, password: hashedPassword } = account
    const isPasswordValid = await this.hashComparer.compare(password, hashedPassword)
    if (!isPasswordValid) return null
    const token = await this.tokenGenerator.encrypt(id)
    if (!token) return null
    await this.updateAccessTokenRepository.updateAccessToken(id, token)
    return token
  }
}
