import { SaveSurveyResultModel } from '../../../domain/usecases/survey'
import { SurveyResultRepository } from '../../protocols/survey-result-repository'
import { DbSurveyResult } from './db-survey-result'

const makeSurveyResultRepositoryStub = (): jest.Mocked<SurveyResultRepository> => {
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

describe('DbSurvey', () => {
  let surveyResultRepositoryStub: jest.Mocked<SurveyResultRepository>
  let dbSurveyResult: SurveyResultRepository
  const surveyResult: SaveSurveyResultModel = {
    surveyId: 'any_id',
    userId: 'any_id',
    answer: 'any_answer',
    date: new Date('2023-10-05T12:34:56Z')
  }

  beforeEach(() => {
    surveyResultRepositoryStub = makeSurveyResultRepositoryStub()
    dbSurveyResult = new DbSurveyResult(surveyResultRepositoryStub)
  })

  test('should return true when survey redsult is successfully added', async () => {
    const response = await dbSurveyResult.save(surveyResult)
    expect(response).toEqual({
      id: 'any_id',
      surveyId: 'any_id',
      userId: 'any_id',
      answer: 'any_answer',
      date: new Date('2023-10-05T12:34:56Z')
    })
  })

  test('should throw if surveyRepository throws', async () => {
    surveyResultRepositoryStub.save.mockRejectedValueOnce(new Error('Database error'))
    await expect(dbSurveyResult.save(surveyResult)).rejects.toThrow('Database error')
  })

  test('should call surveyResultRepository save with correct values', async () => {
    await dbSurveyResult.save(surveyResult)
    expect(surveyResultRepositoryStub.save).toHaveBeenCalledWith({
      surveyId: 'any_id',
      userId: 'any_id',
      answer: 'any_answer',
      date: new Date('2023-10-05T12:34:56Z')
    })
  })
})
