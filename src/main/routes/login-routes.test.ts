import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/mongo-helper/mongo-helper'
import env from '../config/env'
import { Collection } from 'mongodb'
import { AddAccountModel } from '../../domain/usecases/add-account'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes Test', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    test('Ensure signup route exists and returns a value', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Ensure login route exists and returns status 200', async () => {
      const password = await hash('CH@MP1', 12)
      const account: AddAccountModel = {
        name: 'Champirom',
        email: 'champ@mail.com',
        password
      }
      await accountCollection.insertOne(account)
      await request(app)
        .post('/api/login')
        .send({
          email: 'champ@mail.com',
          password: 'CH@MP1'
        })
        .expect(200)
    })

    test('Ensure login returns status 401 when wrong password', async () => {
      const password = await hash('CH@MP1', 12)
      const account: AddAccountModel = {
        name: 'Champirom',
        email: 'champ@mail.com',
        password
      }
      await accountCollection.insertOne(account)
      await request(app)
        .post('/api/login')
        .send({
          email: 'champ@mail.com',
          password: '123'
        })
        .expect(401)
    })

    test('Ensure login route returns 401 when email doesnt exist', async () => {
      const password = await hash('CH@MP1', 12)
      const account: AddAccountModel = {
        name: 'Champirom',
        email: 'champ@mail.com',
        password
      }
      await accountCollection.insertOne(account)
      await request(app)
        .post('/api/login')
        .send({
          email: 'not_exists@mail.com',
          password: 'CH@MP1'
        })
        .expect(401)
    })
  })
})
