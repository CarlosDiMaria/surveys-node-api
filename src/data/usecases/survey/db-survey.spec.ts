import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/survey'
import { AddSurveyRepository } from '../../protocols/survey-repository'
import { DbSurvey } from './db-survey'

const makeSurveyRepositoryStub = (): AddSurveyRepository => {
  return {
    add: jest.fn().mockResolvedValue(true)
  }
}

describe('DbSurvey', () => {
  let surveyRepositoryStub
  let dbSurvey: AddSurvey
  const addSurvey: AddSurveyModel = {
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }]
  }

  beforeEach(() => {
    surveyRepositoryStub = makeSurveyRepositoryStub()
    dbSurvey = new DbSurvey(surveyRepositoryStub)
  })

  test('should return true when survey is successfully added', async () => {
    const result = await dbSurvey.add(addSurvey)
    expect(result).toBe(true)
    expect(surveyRepositoryStub.add).toHaveBeenCalledWith({
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      }]
    })
  })

  test('should return false when survey creation fails', async () => {
    surveyRepositoryStub.add.mockResolvedValue(false)
    const result = await dbSurvey.add(addSurvey)
    expect(result).toBe(false)
  })

  test('should handle errors from the repository', async () => {
    surveyRepositoryStub.add.mockRejectedValue(new Error('Database error'))
    await expect(dbSurvey.add(addSurvey)).rejects.toThrow('Database error')
  })
})
