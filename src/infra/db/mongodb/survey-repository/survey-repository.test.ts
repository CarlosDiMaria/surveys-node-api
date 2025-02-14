import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-repository'
import { MongoHelper } from '../mongo-helper/mongo-helper'

describe('SurveyMongoRepository Integration Tests', () => {
  let surveyCollection: Collection
  const surveyMongoRepository = new SurveyMongoRepository()
  const surveyData = { question: 'any_question', answers: [{ answer: 'any_answer', image: 'any_image' }], date: new Date() }

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should insert a survey and return true', async () => {
    const result = await surveyMongoRepository.add(surveyData)
    expect(result).toBe(true)
    const collection = await MongoHelper.getCollection('survey')
    const insertedSurvey = await collection.findOne({ question: 'any_question' })
    expect(insertedSurvey).toBeTruthy()
    expect(insertedSurvey?.question).toBe('any_question')
  })

  test('should throw if insert fails', async () => {
    jest.spyOn(MongoHelper, 'getCollection').mockRejectedValueOnce(new Error('Insert error'))
    await expect(surveyMongoRepository.add(surveyData)).rejects.toThrow('Insert error')
  })
})
