import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-repository'
import { MongoHelper } from '../mongo-helper/mongo-helper'

describe('SurveyMongoRepository Integration Tests', () => {
  let surveyCollection: Collection
  const surveyMongoRepository = new SurveyMongoRepository()
  const surveyData = { question: 'any_question', answers: [{ answer: 'any_answer', image: 'any_image' }], date: new Date('2023-10-05T12:34:56Z') }
  const multipleSurveys = [{ question: 'any_question', answers: [{ answer: 'any_answer', image: 'any_image' }], date: new Date('2023-10-05T12:34:56Z') }, { question: 'any_question', answers: [{ answer: 'any_answer', image: 'any_image' }], date: new Date('2023-10-05T12:34:56Z') }]

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should insert a survey and return true', async () => {
    const result = await surveyMongoRepository.add(surveyData)
    expect(result).toBe(true)
    const collection = await MongoHelper.getCollection('surveys')
    const insertedSurvey = await collection.findOne({ question: 'any_question' })
    expect(insertedSurvey).toBeTruthy()
    expect(insertedSurvey?.question).toBe('any_question')
  })

  test('should throw if insert fails', async () => {
    jest.spyOn(MongoHelper, 'getCollection').mockRejectedValueOnce(new Error('Insert error'))
    await expect(surveyMongoRepository.add(surveyData)).rejects.toThrow('Insert error')
  })

  test('should throw if insert fails', async () => {
    jest.spyOn(MongoHelper, 'getCollection').mockRejectedValueOnce(new Error('Insert error'))
    await expect(surveyMongoRepository.loadSurveys()).rejects.toThrow('Insert error')
  })

  test('should load survey if loadById is successfull', async () => {
    await surveyCollection.insertMany(multipleSurveys)
    const dbExistingSurveys = await surveyCollection.find({}).toArray()
    const mappedExistingSurveys = dbExistingSurveys.map(s => MongoHelper.map(s))
    const surveysResponse = await surveyMongoRepository.loadSurveys()
    expect(surveysResponse).toEqual(mappedExistingSurveys)
  })

  test('should load surveyy on loadSurveys success', async () => {
    const { insertedIds } = await surveyCollection.insertMany(multipleSurveys)
    const survey = await surveyMongoRepository.loadById(insertedIds[0].toString())
    delete (survey as any).id
    expect(survey).toEqual({ question: 'any_question', answers: [{ answer: 'any_answer', image: 'any_image' }], date: new Date('2023-10-05T12:34:56Z') })
  })

  test('should throw if finOne fails', async () => {
    jest.spyOn(MongoHelper, 'connect').mockRejectedValueOnce(new Error('input must be a 24 character hex string, 12 byte Uint8Array, or an integer'))
    await expect(surveyMongoRepository.loadById('false_id')).rejects.toThrow('input must be a 24 character hex string, 12 byte Uint8Array, or an integer')
  })
})
