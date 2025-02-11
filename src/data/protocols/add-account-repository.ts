import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usecases/add-account'
import { LoadAccountByEmailRepository } from './load-account-repository'

export interface AddAccountRepository extends LoadAccountByEmailRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel | null>
}
