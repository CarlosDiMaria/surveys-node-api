import { ObjectId } from 'mongodb'
import { SurveyResultRepository } from '../../../../data/protocols/survey-result-repository'
import { SurveyResultModel } from '../../../../domain/models/survey'
import { SaveSurveyResultModel } from '../../../../domain/usecases/survey'
import { MongoHelper } from '../mongo-helper/mongo-helper'

export class SurveyResultMongoRepository implements SurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const surveyResponse = await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      userId: new ObjectId(data.userId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    return MongoHelper.map(surveyResponse)
  }
}
