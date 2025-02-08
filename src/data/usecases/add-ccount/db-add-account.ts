import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Hasher } from '../../protocols/hasher'

export class DbAddAccount implements AddAccount {
  hasher: Hasher
  addAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.hasher.hash(accountData.password)
    const createdAccount = await this.addAccountRepository.add(Object.assign({} , accountData, { password: encryptedPassword }))
    return new Promise((resolve) => { resolve(createdAccount) })
  }
}
