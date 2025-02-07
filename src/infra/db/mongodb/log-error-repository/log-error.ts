import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../mongo-helper/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const logErrorCollection = await MongoHelper.getCollection('log-error')
    await logErrorCollection.insertOne({
      error: stack,
      date: new Date()
    })
  }
}
