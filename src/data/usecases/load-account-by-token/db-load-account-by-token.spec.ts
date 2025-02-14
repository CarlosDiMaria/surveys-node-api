import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/load-account-repository'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypterStub = (): jest.Mocked<Decrypter> => {
  return {
    decrypt: jest.fn().mockResolvedValue('any_token')
  }
}

const makeLoadAccountByTokenRepositoryStub = (): jest.Mocked<LoadAccountByTokenRepository> => {
  return {
    loadByToken: jest.fn().mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      password: 'any_password'
    })
  }
}

describe('DbLoadAccountByToken', () => {
  const decrypterStub: jest.Mocked<Decrypter> = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub: jest.Mocked<LoadAccountByTokenRepository> = makeLoadAccountByTokenRepositoryStub()
  const sut: LoadAccountByToken = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)

  test('Should call decrypter with correct values', async () => {
    await sut.loadByToken('any_token', 'any_role')
    expect(decrypterStub.decrypt).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if decrypter returns null', async () => {
    decrypterStub.decrypt.mockReturnValueOnce(Promise.resolve(''))
    const response = await sut.loadByToken('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    await sut.loadByToken('any_token', 'any_role')
    expect(loadAccountByTokenRepositoryStub.loadByToken).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null LoadAccountByTokenRepository returns null', async () => {
    loadAccountByTokenRepositoryStub.loadByToken.mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.loadByToken('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should return an account on success', async () => {
    const response = await sut.loadByToken('any_token', 'any_role')
    expect(response).toEqual({
      id: 'any_id',
      name: 'any_name',
      password: 'any_password'
    })
  })
})
