import { LoadSurvey } from '../../../domain/usecases/survey'
import { ok, serverError } from '../../helpers/http-helper'
import { Controller } from '../../protocols'
import { LoadSurveyController } from './load-surveys'

const fakeSurveys = [
  {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  },
  {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
]

const makeDbLoadSurveysStub = (): jest.Mocked<LoadSurvey> => {
  return {
    loadSurveys: jest.fn().mockResolvedValue(fakeSurveys)
  }
}

describe('LoadSurveyController', () => {
  const dbLoadSurvey: jest.Mocked<LoadSurvey> = makeDbLoadSurveysStub()
  const sut: Controller = new LoadSurveyController(dbLoadSurvey)

  test('Should call load from surveys', async () => {
    await sut.handle({})
    expect(dbLoadSurvey.loadSurveys).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(fakeSurveys))
  })

  test('Should return 500 if loadSurveys throws', async () => {
    dbLoadSurvey.loadSurveys.mockRejectedValueOnce(new Error())
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
})
