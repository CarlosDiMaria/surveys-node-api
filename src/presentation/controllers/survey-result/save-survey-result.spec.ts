import { LoadSurveyById, SaveSurveyResult } from '../../../domain/usecases/survey'
import { InvalidParamError } from '../../erros'
import { forbidden, ok, serverError } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { SaveSurveyResultController } from './save-survey-result'

const makeDbSurveyResultStub = (): jest.Mocked<SaveSurveyResult> => {
  return {
    save: jest.fn().mockResolvedValue({
      id: 'any_id',
      surveyId: 'any_id',
      userId: 'any_id',
      answer: 'any_answer',
      date: new Date('2023-10-05T12:34:56Z')
    })
  }
}

const makeDbSurveyStub = (): jest.Mocked<LoadSurveyById> => {
  return {
    loadById: jest.fn().mockResolvedValue({
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer_1'
      }, {
        image: 'any_image',
        answer: 'any_answer_2'
      }]
    })
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-10-05T12:34:56Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const httRequest: HttpRequest = {
    params: {
      surveyId: 'any_survey_id'
    },
    body: {
      answer: 'any_answer_1',
      date: new Date('2023-10-05T12:34:56Z')
    },
    userId: 'any_user_id'
  }
  const dbSurveyStub: jest.Mocked<LoadSurveyById> = makeDbSurveyStub()
  const dbSurveyResultStub: jest.Mocked<SaveSurveyResult> = makeDbSurveyResultStub()
  const saveSurveyResultController: SaveSurveyResultController = new SaveSurveyResultController(dbSurveyResultStub, dbSurveyStub)

  test('Should call LoadSurveyById with correct values', async () => {
    await saveSurveyResultController.handle(httRequest)
    expect(dbSurveyStub.loadById).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    dbSurveyStub.loadById.mockReturnValueOnce(Promise.resolve(null))
    const response = await saveSurveyResultController.handle(httRequest)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return serverError if LoadSurveyById throws', async () => {
    dbSurveyStub.loadById.mockRejectedValueOnce(new Error('loadById error'))
    const response = await saveSurveyResultController.handle(httRequest)
    expect(response).toEqual(serverError(new Error('loadById error')))
  })

  test('Should return forbidden if wrong answer is provided', async () => {
    const wrongRequest: HttpRequest = {
      body: {
        answer: 'wrong_answer'
      }
    }
    const response = await saveSurveyResultController.handle(wrongRequest)
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyresult with correct values', async () => {
    await saveSurveyResultController.handle(httRequest)
    expect(dbSurveyResultStub.save).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      userId: 'any_user_id',
      answer: 'any_answer_1',
      date: new Date('2023-10-05T12:34:56Z')
    })
  })

  test('Should return serverError if SaveSurveyResult throws', async () => {
    dbSurveyResultStub.save.mockRejectedValueOnce(new Error('SaveSurveyResult error'))
    const response = await saveSurveyResultController.handle(httRequest)
    expect(response).toEqual(serverError(new Error('SaveSurveyResult error')))
  })

  test('Should return 200 on success', async () => {
    const response = await saveSurveyResultController.handle(httRequest)
    expect(response).toEqual(ok({
      id: 'any_id',
      surveyId: 'any_id',
      userId: 'any_id',
      answer: 'any_answer',
      date: new Date('2023-10-05T12:34:56Z')
    }))
  })
})
