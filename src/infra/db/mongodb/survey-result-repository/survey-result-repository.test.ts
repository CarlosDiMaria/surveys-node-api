import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-repository'
import { MongoHelper } from '../mongo-helper/mongo-helper'
import { AddSurveyModel, SaveSurveyResultModel } from '../../../../domain/usecases/survey'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

describe('SurveyResultMongoRepository Integration Tests', () => {
  let surveyResultsCollection: Collection
  let surveyCollection: Collection
  let accountCollection: Collection
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const saveSurveyResultData: SaveSurveyResultModel = {
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

  const addSurvey2: AddSurveyModel = {
    question: 'any_question',
    answers: [{
      answer: 'any_answer_1',
      image: 'any_image_1'
    },
    {
      answer: 'any_answer_2',
      image: 'any_image_2'
    },
    {
      answer: 'any_answer_3',
      image: 'any_image_3'
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
    surveyCollection = await MongoHelper.getCollection('surveys')
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
    expect(result?.answers?.[0]?.answer).toBe(saveSurveyResultData.answer)
    expect(result?.answers?.[0]?.count).toBe(1)
    expect(result?.answers?.[0]?.percent).toBe(100)
    expect(result?.answers?.[1]?.answer).toBe('any_answer_2')
    expect(result?.answers?.[1]?.count).toBe(0)
    expect(result?.answers?.[1]?.percent).toBe(0)
    expect(result?.date).toEqual(new Date('2023-10-05T12:34:56Z'))
  })

  test('should update a surveyResult when it is not new', async () => {
    const survey = await surveyCollection.insertOne(addSurvey)
    const insertedSurvey = await surveyCollection.findOne({ _id: survey.insertedId })
    const account = await accountCollection.insertOne(addAccount)
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    saveSurveyResultData.userId = account.insertedId.toString()
    saveSurveyResultData.surveyId = survey.insertedId.toString()
    saveSurveyResultData.answer = insertedSurvey?.answers?.[1]?.answer
    const result = await surveyResultMongoRepository.save(saveSurveyResultData)
    expect(result).toBeTruthy()
    expect(result?.surveyId).toEqual(survey.insertedId)
    expect(result?.answers?.[0]?.answer).toBe(saveSurveyResultData.answer)
    expect(result?.answers?.[0]?.count).toBe(1)
    expect(result?.answers?.[0]?.percent).toBe(100)
    expect(result?.answers?.[1]?.answer).toBe('any_answer_1')
    expect(result?.answers?.[1]?.count).toBe(0)
    expect(result?.answers?.[1]?.percent).toBe(0)
    expect(result?.date).toEqual(new Date('2023-10-05T12:34:56Z'))
  })

  test('should throw if insert fails', async () => {
    jest.spyOn(MongoHelper, 'getCollection').mockRejectedValueOnce(new Error('Insert error'))
    await expect(surveyResultMongoRepository.save(saveSurveyResultData)).rejects.toThrow('Insert error')
  })

  test('should load surveyResult when loadSurveyById is successfull 4 answers test', async () => {
    const survey = await surveyCollection.insertOne(addSurvey)
    const insertedSurvey = await surveyCollection.findOne({ _id: survey.insertedId })
    const account = await accountCollection.insertOne(addAccount)
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[1]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    const result = await surveyResultMongoRepository.loadBySurveyId(survey.insertedId.toString())
    expect(result).toBeTruthy()
    expect(result?.surveyId).toEqual(survey.insertedId)
    expect(result?.answers?.[0]?.answer).toBe('any_answer_1')
    expect(result?.answers?.[0]?.count).toBe(3)
    expect(result?.answers?.[0]?.percent).toBe(75)
    expect(result?.answers?.[1]?.answer).toBe('any_answer_2')
    expect(result?.answers?.[1]?.count).toBe(1)
    expect(result?.answers?.[1]?.percent).toBe(25)
  })

  test('should load surveyResult when loadSurveyById is successfull 5 answers test', async () => {
    const survey = await surveyCollection.insertOne(addSurvey2)
    const insertedSurvey = await surveyCollection.findOne({ _id: survey.insertedId })
    const account = await accountCollection.insertOne(addAccount)
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[0]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[1]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    await surveyResultsCollection.insertOne({
      surveyId: survey.insertedId,
      userId: account.insertedId,
      answer: insertedSurvey?.answers?.[2]?.answer,
      date: new Date('2023-10-05T12:33:33Z')
    })
    const result = await surveyResultMongoRepository.loadBySurveyId(survey.insertedId.toString())
    expect(result).toBeTruthy()
    expect(result?.surveyId).toEqual(survey.insertedId)
    expect(result?.answers?.[0]?.answer).toBe('any_answer_1')
    expect(result?.answers?.[0]?.count).toBe(3)
    expect(result?.answers?.[0]?.percent).toBe(60)
    expect(result?.answers?.[1]?.answer).toBe('any_answer_2')
    expect(result?.answers?.[1]?.count).toBe(1)
    expect(result?.answers?.[1]?.percent).toBe(20)
    expect(result?.answers?.[2]?.answer).toBe('any_answer_3')
    expect(result?.answers?.[2]?.count).toBe(1)
    expect(result?.answers?.[2]?.percent).toBe(20)
  })
})
