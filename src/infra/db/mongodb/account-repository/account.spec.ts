import { MongoHelper } from '../mongo-helper/mongo-helper'
import { AccountMongoRepository } from './account'
import env from '../../../../main/config/env'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on add sucess', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toEqual('any_name')
    expect(account.email).toEqual('any_email@mail.com')
    expect(account.password).toEqual('any_password')
  })

  test('Should return an account on loadByEmail sucess', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toEqual('any_name')
    expect(account?.email).toEqual('any_email@mail.com')
    expect(account?.password).toEqual('any_password')
  })

  test('Should return null on loadByEmail fails', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeNull()
  })

  test('Should update account accessToken on updateAccessToken success', async () => {
    const sut = new AccountMongoRepository()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    await sut.updateAccessToken(res.insertedId.toString(), 'any_token')
    const updatedAccount = await accountCollection.findOne({ _id: res.insertedId })
    expect(updatedAccount).toBeTruthy()
    expect(updatedAccount?.accessToken).toBe('any_token')
  })

  test('Should return an account on loadByToken sucess without role', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token'
    })
    const account = await sut.loadByToken('any_token')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toEqual('any_name')
    expect(account?.email).toEqual('any_email@mail.com')
    expect(account?.password).toEqual('any_password')
  })

  test('Should return an account on loadByToken sucess with role', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token',
      role: 'any_role'
    })
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toEqual('any_name')
    expect(account?.email).toEqual('any_email@mail.com')
    expect(account?.password).toEqual('any_password')
  })

  test('Should return null if no account is found', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
