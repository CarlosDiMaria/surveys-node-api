import { ObjectId } from 'mongodb'
import { SurveyRepository } from '../../../../data/protocols/survey-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/survey'
import { MongoHelper } from '../mongo-helper/mongo-helper'

export class SurveyMongoRepository implements SurveyRepository {
  async add (data: AddSurveyModel): Promise<boolean> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const result = await surveyCollection.insertOne(data)
    if (result?.insertedId) return true
    return false
  }

  async loadSurveys (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const surveys = await surveyCollection.find({}).toArray()
    const surveysAux = surveys.map((s) => MongoHelper.map(s))
    return surveysAux
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    if (!survey) {
      return Promise.resolve(null)
    }
    return MongoHelper.map(survey)
  }
}
