import { Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-repository'
import { TokenGenerator } from '../../protocols/token-generator'
import { UpdateAccessTokenRepository } from '../../protocols/update-access-token-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepositoryStub: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepositoryStub = updateAccessTokenRepositoryStub
  }

  async auth (email: string, password: string): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return null
    const { id, password: hashedPassword } = account
    const isPasswordValid = await this.hashComparer.compare(password, hashedPassword)
    if (!isPasswordValid) return null
    const token = await this.tokenGenerator.generate(id)
    if (!token) return null
    await this.updateAccessTokenRepositoryStub.update(id, token)
    return token
  }
}
