import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/mongo-helper/mongo-helper'
import env from '../config/env'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey Routes Test', () => {
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

  describe('POST /survey', () => {
    test('Ensure survey route exists and returns status 204', async () => {
      const survey = { question: 'Any Question', answers: [{ answer: 'Answer 1' }] }
      await request(app)
        .post('/api/survey')
        .send(survey)
        .expect(204)
    })

    test('Ensure survey returns status 400 when wrong data', async () => {
      const survey = { question: '', answers: [{ answer: 'Answer 1' }] }
      await request(app)
        .post('/api/survey')
        .send(survey)
        .expect(400)
    })
  })
})
