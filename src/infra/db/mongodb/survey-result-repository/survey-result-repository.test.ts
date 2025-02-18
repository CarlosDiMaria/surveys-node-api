import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-repository'
import { MongoHelper } from '../mongo-helper/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecases/survey'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

describe('SurveyResultMongoRepository Integration Tests', () => {
  let surveyResultsCollection: Collection
  let surveyCollection: Collection
  let accountCollection: Collection
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const saveSurveyResultData = {
    surveyId: 'any_id',
    userId: 'any_id',
    answer: 'any_answer',
    date: new Date('2023-10-05T12:34:56Z')
  }

  const addSurvey: AddSurveyModel = {
    question: 'any_question',
    answers: [{
      answer: 'any_answer_1',
      image: 'any_image_1'
    },
    {
      answer: 'any_answer_2',
      image: 'any_image_2'
    }],
    date: new Date('2023-10-05T12:34:56Z')
  }

  const addAccount: AddAccountModel = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_hashed_password'
  }

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultsCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should insert a surveyResult when it doesnt exist', async () => {
    const survey = await surveyCollection.insertOne(addSurvey)
    const insertedSurvey = await surveyCollection.findOne({ _id: survey.insertedId })
    const account = await accountCollection.insertOne(addAccount)
    saveSurveyResultData.userId = account.insertedId.toString()
    saveSurveyResultData.surveyId = survey.insertedId.toString()
    saveSurveyResultData.answer = insertedSurvey?.answers?.[0]?.answer
    const result = await surveyResultMongoRepository.save(saveSurveyResultData)
    expect(result).toBeTruthy()
    expect(result?.surveyId).toEqual(survey.insertedId)
    expect(result?.userId).toEqual(account.insertedId)
    expect(result?.answer).toBe(addSurvey.answers[0].answer)
    expect(result?.date).toEqual(new Date('2023-10-05T12:34:56Z'))
  })

  test('should update a surveyResult when it is not new', async () => {
    const survey = await surveyCollection.insertOne(addSurvey)
    const insertedSurvey = await surveyCollection.findOne({ _id: survey.insertedId })
    const account = await accountCollection.insertOne(addAccount)
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId.toString(),
      userId: account.insertedId.toString(),
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    saveSurveyResultData.userId = account.insertedId.toString()
    saveSurveyResultData.surveyId = survey.insertedId.toString()
    saveSurveyResultData.answer = insertedSurvey?.answers?.[1]?.answer
    const result = await surveyResultMongoRepository.save(saveSurveyResultData)
    expect(result).toBeTruthy()
    expect(result?.surveyId).toEqual(survey.insertedId)
    expect(result?.userId).toEqual(account.insertedId)
    expect(result?.answer).toBe(addSurvey.answers[1].answer)
    expect(result?.date).toEqual(new Date('2023-10-05T12:34:56Z'))
  })

  test('should throw if insert fails', async () => {
    jest.spyOn(MongoHelper, 'getCollection').mockRejectedValueOnce(new Error('Insert error'))
    await expect(surveyResultMongoRepository.save(saveSurveyResultData)).rejects.toThrow('Insert error')
  })
})
