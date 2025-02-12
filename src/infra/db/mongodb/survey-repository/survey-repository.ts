import { AddSurveyRepository } from '../../../../data/protocols/survey-repository'
import { AddSurveyModel } from '../../../../domain/usecases/survey'
import { MongoHelper } from '../mongo-helper/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<boolean> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const result = await surveyCollection.insertOne(data)
    if (result?.insertedId) return true
    return false
  }
}
