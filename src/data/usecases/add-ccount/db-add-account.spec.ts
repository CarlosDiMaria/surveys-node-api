import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Hasher } from '../../protocols/hasher'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount UseCase', () => {
  interface SutTypes {
    encrypterStub: Hasher
    sut: DbAddAccount
    addAccountRepositoryStub: AddAccountRepository
  }

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add (accountData: AddAccountModel): Promise<AccountModel | null> {
        const fakeAccount = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email',
          password: 'valid_hashed_password'
        }
        return new Promise(resolve => { resolve(fakeAccount) })
      }

      async loadByEmail (email: string): Promise<AccountModel | null> {
        return new Promise(resolve => resolve(null))
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeEncrypter = (): Hasher => {
    class EncrypterStub implements Hasher {
      async hash (value: string): Promise<string> {
        return new Promise(resolve => { resolve('valid_hashed_password') })
      }
    }
    return new EncrypterStub()
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
      sut,
      encrypterStub,
      addAccountRepositoryStub
    }
  }

  test('Should call Hasher with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if hasher throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const accountData = {
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_hashed_password'
    })
  })

  test('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const accountData = {
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return account if addAccount is successful', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const retorno = await sut.add(accountData)
    expect(retorno).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_hashed_password'
    })
  })

  test('Should call loadByEmail with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(addAccountRepositoryStub, 'loadByEmail')
    const accountData = {
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_mail@mail.com')
  })

  test('Should return null if account exists', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    })))
    const accountData = {
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    const response = await sut.add(accountData)
    expect(response).toBeNull()
  })
})
