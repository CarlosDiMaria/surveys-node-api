import { AccountModel } from '../../../domain/models/account'
import { Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-repository'
import { TokenGenerator } from '../../protocols/token-generator'
import { UpdateAccessTokenRepository } from '../../protocols/update-access-token-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  interface SutTypes {
    sut: Authentication
    loadAccountByEmailRepository: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  }

  const makeSut = (): SutTypes => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async update (id: string, token: string): Promise<void> {
      }
    }
    class TokenGeneratorStub implements TokenGenerator {
      async generate (id: string): Promise<string | null> {
        return new Promise(resolve => resolve('any_token'))
      }
    }
    class HashComparerStub implements HashComparer {
      async compare (password: string, hashedPassword: string): Promise<boolean> {
        return new Promise(resolve => resolve(true))
      }
    }
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_hashed_password'
        }
        return new Promise(resolve => resolve(account))
      }
    }
    const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
    const hashComparerStub = new HashComparerStub()
    const tokenGeneratorStub = new TokenGeneratorStub()
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(
      loadAccountByEmailRepository,
      hashComparerStub,
      tokenGeneratorStub,
      updateAccessTokenRepositoryStub
    )
    return {
      sut,
      loadAccountByEmailRepository,
      hashComparerStub,
      tokenGeneratorStub,
      updateAccessTokenRepositoryStub
    }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth('any_mail@mail.com', 'any_password')
    expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth('any_mail@mail.com', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.auth('any_mail@mail.com', 'any_password')
    expect(response).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth('any_mail@mail.com', 'any_password')
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.auth('any_mail@mail.com', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const response = await sut.auth('any_mail@mail.com', 'any_password')
    expect(response).toBeNull()
  })

  test('Should call TokenGenerator with correct value', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth('any_mail@mail.com', 'any_password')
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.auth('any_mail@mail.com', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if TokenGenerator returns null', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.auth('any_mail@mail.com', 'any_password')
    expect(response).toBeNull()
  })

  test('Should return token if success', async () => {
    const { sut } = makeSut()
    const response = await sut.auth('any_mail@mail.com', 'any_password')
    expect(response).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct value', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth('any_mail@mail.com', 'any_password')
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.auth('any_mail@mail.com', 'any_password')
    await expect(promise).rejects.toThrow()
  })
})
