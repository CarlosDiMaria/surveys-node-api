import { AddSurvey } from '../../../domain/usecases/survey'
import { MissingParamError, ServerError } from '../../erros'
import { badRequest, noContentOk, serverError } from '../../helpers/http-helper'
import { AddSurveyController } from './add-survey'

const makeDbSurveyStub = (): AddSurvey => {
  return {
    add: jest.fn().mockResolvedValue(true)
  }
}

describe('AddSurveyController', () => {
  let addSurveyController
  let dbSurveyStub

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
    expect(dbSurveyStub.add).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 204 if survey is created successfully', async () => {
    const httpRequest = { body: { question: 'Any Question', answers: [{ answer: 'Answer 1' }] } }
    const response = await addSurveyController.handle(httpRequest)
    expect(response).toEqual(noContentOk())
  })

  test('should return 500 if dbSurvey.add throws an error', async () => {
    dbSurveyStub.add.mockRejectedValueOnce(new Error('Database error'))
    const httpRequest = { body: { question: 'Any Question', answers: [{ answer: 'Answer 1' }] } }
    const response = await addSurveyController.handle(httpRequest)
    expect(response).toEqual(serverError(new ServerError('Database error')))
  })
})
