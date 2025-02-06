import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../mongo-helper/mongo-helper'
import { MongoAccountModel } from '../protocols/mongo-account-protocol'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne(account)
    const insertedAccount = await accountCollection.findOne(result.insertedId) as MongoAccountModel
    return MongoHelper.map(insertedAccount)
  }
}
