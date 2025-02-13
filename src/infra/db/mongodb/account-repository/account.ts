import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../mongo-helper/mongo-helper'
import { MongoAccountModel } from '../protocols/mongo-account-protocol'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/load-account-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne(account)
    const insertedAccount = await accountCollection.findOne(result.insertedId) as MongoAccountModel
    return MongoHelper.map(insertedAccount)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ email })
    if (!account?._id?.toString()) {
      return null
    }
    return MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('account')
    const mongoId = new ObjectId(id)
    await accountCollection.updateOne(
      { _id: mongoId },
      { $set: { accessToken: token } }
    )
    const account = await accountCollection.findOne({ _id: mongoId })
    return MongoHelper.map(account)
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ accessToken: token, role })
    if (account) {
      return MongoHelper.map(account)
    }
    return Promise.resolve(null)
  }
}
