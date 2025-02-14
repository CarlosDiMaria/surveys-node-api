import { AddSurvey } from '../../../domain/usecases/survey'
import { MissingParamError, ServerError } from '../../erros'
import { badRequest, noContentOk, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols'
import { AddSurveyController } from './add-survey'

const makeDbSurveyStub = (): jest.Mocked<AddSurvey> => {
  return {
    add: jest.fn().mockResolvedValue(true)
  }
}

describe('AddSurveyController', () => {
  let addSurveyController: Controller
  let dbSurveyStub: jest.Mocked<AddSurvey>

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-10-05T12:34:56Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    dbSurveyStub = makeDbSurveyStub()
    addSurveyController = new AddSurveyController(dbSurveyStub)
  })

  test('should return 400 if no question is provided', async () => {
    const httpRequest = { body: { answers: [{ answer: 'Answer 1' }] } }
    const response = await addSurveyController.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('question')))
  })

  test('should return 400 if any answer is missing', async () => {
    const httpRequest = { body: { question: 'Any Question', answers: [{ answer: '' }] } }
    const response = await addSurveyController.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('answer')))
  })

  test('should call dbSurvey.add with correct values', async () => {
    const httpRequest = { body: { question: 'Any Question', answers: [{ answer: 'Answer 1' }] } }
    await addSurveyController.handle(httpRequest)
    expect(dbSurveyStub.add).toHaveBeenCalledWith({ question: 'Any Question', answers: [{ answer: 'Answer 1' }], date: new Date('2023-10-05T12:34:56Z') })
  })

  test('should return 204 if survey is created successfully', async () => {
    const httpRequest = { body: { question: 'Any Question', answers: [{ answer: 'Answer 1' }] } }
    const response = await addSurveyController.handle(httpRequest)
    expect(response).toEqual(noContentOk())
  })

  test('should return 500 if dbSurvey.add throws an error', async () => {
    dbSurveyStub.add.mockRejectedValueOnce(new Error('Database error'))
    const httpRequest = { body: { question: 'Any Question', answers: [{ answer: 'Answer 1' }], date: new Date() } }
    const response = await addSurveyController.handle(httpRequest)
    expect(response).toEqual(serverError(new ServerError('Database error')))
  })
})
