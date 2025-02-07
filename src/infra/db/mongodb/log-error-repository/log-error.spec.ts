import { MongoHelper } from '../mongo-helper/mongo-helper'
import env from '../../../../main/config/env'
import { LogErrorMongoRepository } from './log-error'

describe('Account Mongo Repository', () => {
  let errorCollection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('log-error')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on sucess', async () => {
    const sut = new LogErrorMongoRepository()
    await sut.log('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
