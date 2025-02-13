import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/mongo-helper/mongo-helper'
import env from '../config/env'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes Test', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    accountCollection = await MongoHelper.getCollection('account')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /survey', () => {
    test('Ensure survey route exists and returns status 403 if no accessToken', async () => {
      const survey = { question: 'Any Question', answers: [{ answer: 'Answer 1' }] }
      await request(app)
        .post('/api/survey')
        .send(survey)
        .expect(403)
    })

    test('Ensure survey route exists and returns status 204 if accessToken is in headers', async () => {
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        role: 'admin'
      })
      const accessToken = sign({ id: res.insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne(
        { _id: res.insertedId },
        { $set: { accessToken } }
      )
      const survey = { question: 'Any Question', answers: [{ answer: 'Answer 1' }] }
      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
        .send(survey)
        .expect(204)
    })

    test('Ensure survey returns status 400 when wrong data', async () => {
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        role: 'admin'
      })
      const accessToken = sign({ id: res.insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne(
        { _id: res.insertedId },
        { $set: { accessToken } }
      )
      const survey = { question: '', answers: [{ answer: 'Answer 1' }] }
      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
        .send(survey)
        .expect(400)
    })
  })
})
