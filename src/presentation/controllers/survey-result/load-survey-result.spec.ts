import { SurveyModel, SurveyResultModel } from '../../../domain/models/survey'
import { LoadSurveyById, LoadSurveyResult } from '../../../domain/usecases/survey'
import { InvalidParamError, ServerError } from '../../erros'
import { forbidden, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest } from '../../protocols'
import { LoadSurveyResultController } from './load-survey-result'

const mockSurveyResult: SurveyResultModel = {
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer_1',
      count: 1,
      percent: 100
    },
    {
      image: 'any_image',
      answer: 'any_answer_2',
      count: 0,
      percent: 0
    }
  ],
  date: new Date('2023-10-05T12:34:56Z')
}

const mockSurvey: SurveyModel = {
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
}

const httpRequest: HttpRequest = {
  params: {
    surveyId: 'any_id'
  }
}

describe('LoadSurveyResultController', () => {
  const makeDbLoadSurveyResultStub = (): jest.Mocked<LoadSurveyResult> => ({ loadBySurveyId: jest.fn().mockResolvedValue(mockSurveyResult) })
  const makeDbLoadSurveyByIdStub = (): jest.Mocked<LoadSurveyById> => ({ loadById: jest.fn().mockResolvedValue(mockSurvey) })

  const dbLoadSurveyByIdStub: jest.Mocked<LoadSurveyById> = makeDbLoadSurveyByIdStub()
  const dbLoadSurveyResultStub: jest.Mocked<LoadSurveyResult> = makeDbLoadSurveyResultStub()
  const loadSurveyResultController: Controller = new LoadSurveyResultController(dbLoadSurveyByIdStub, dbLoadSurveyResultStub)

  test('Should call loadById with correct values', async () => {
    await loadSurveyResultController.handle(httpRequest)
    expect(dbLoadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_id')
  })

  test('Should return 403 if loadById returns null', async () => {
    dbLoadSurveyByIdStub.loadById.mockReturnValueOnce(Promise.resolve(null))
    expect(await loadSurveyResultController.handle(httpRequest)).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should throw return 500 loadById throws', async () => {
    dbLoadSurveyByIdStub.loadById.mockRejectedValueOnce(new Error('Database Error'))
    expect(await loadSurveyResultController.handle(httpRequest)).toEqual(serverError(new ServerError('Database Error')))
  })

  test('Should throw return 500 loadBySurveyId throws', async () => {
    dbLoadSurveyResultStub.loadBySurveyId.mockRejectedValueOnce(new Error('Database Error'))
    expect(await loadSurveyResultController.handle(httpRequest)).toEqual(serverError(new ServerError('Database Error')))
  })

  test('Should call loadBySurveyId with correct values', async () => {
    await loadSurveyResultController.handle(httpRequest)
    expect(dbLoadSurveyResultStub.loadBySurveyId).toHaveBeenCalledWith('any_id')
  })

  test('Should return survey result if loadBySurveyId is successfull', async () => {
    const surveyResult = await loadSurveyResultController.handle(httpRequest)
    expect(surveyResult.statusCode).toEqual(200)
    expect(surveyResult.body).toEqual(mockSurveyResult)
  })
})
