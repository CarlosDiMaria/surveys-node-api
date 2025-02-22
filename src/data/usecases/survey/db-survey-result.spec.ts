import { SaveSurveyResultModel } from '../../../domain/usecases/survey'
import { SurveyResultRepository } from '../../protocols/survey-result-repository'
import { DbSurveyResult } from './db-survey-result'

const mockSurveyResult = {
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

const makeSurveyResultRepositoryStub = (): jest.Mocked<SurveyResultRepository> => {
  return {
    save: jest.fn().mockResolvedValue(mockSurveyResult),
    loadBySurveyId: jest.fn().mockResolvedValue(mockSurveyResult)
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
    expect(response).toEqual(mockSurveyResult)
  })

  test('should throw if surveyRepository save throws', async () => {
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

  test('should return surveyResult when survey loadBySurveyId is successfull', async () => {
    const response = await dbSurveyResult.loadBySurveyId('any_survey_id')
    expect(response).toEqual(mockSurveyResult)
  })

  test('should throw if surveyRepository loadBySurveyId throws', async () => {
    surveyResultRepositoryStub.loadBySurveyId.mockRejectedValueOnce(new Error('Database error'))
    await expect(dbSurveyResult.loadBySurveyId('any_survey_id')).rejects.toThrow('Database error')
  })

  test('should call surveyResultRepository loadBySurveyId with correct value', async () => {
    await dbSurveyResult.loadBySurveyId('any_survey_id')
    expect(surveyResultRepositoryStub.loadBySurveyId).toHaveBeenCalledWith('any_survey_id')
  })
})
