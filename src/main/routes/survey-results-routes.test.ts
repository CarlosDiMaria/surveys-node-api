import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/mongo-helper/mongo-helper'
import env from '../config/env'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyResultsCollection: Collection
let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes Test', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    surveyCollection = await MongoHelper.getCollection('survey')
    accountCollection = await MongoHelper.getCollection('account')
    await surveyResultsCollection.deleteMany({})
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /survey/:surveyId/results', () => {
    test('Ensure survey route exists and returns status 403 if no accessToken', async () => {
      await request(app)
        .put('/api/survey/:surveyId/results')
        .send({
          answer: ''
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http: //image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: new Date()
      })
      const account = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const accessToken = sign({ id: account.insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne(
        { _id: account.insertedId },
        { $set: { accessToken } }
      )
      await request(app)
        .put(`/api/survey/${res.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })
})
