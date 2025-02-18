import { AddSurveyModel } from '../../../domain/usecases/survey'
import { SurveyRepository } from '../../protocols/survey-repository'
import { DbSurvey } from './db-survey'

const makeSurveyRepositoryStub = (): jest.Mocked<SurveyRepository> => {
  return {
    add: jest.fn().mockResolvedValue(true),
    loadSurveys: jest.fn().mockResolvedValue([
      {
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date('2023-10-05T12:34:56Z')
      },
      {
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date('2023-10-05T12:34:56Z')
      }
    ]),
    loadById: jest.fn().mockResolvedValue({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date('2023-10-05T12:34:56Z')
    })
  }
}

describe('DbSurvey', () => {
  let surveyRepositoryStub: jest.Mocked<SurveyRepository>
  let dbSurvey: SurveyRepository
  const addSurvey: AddSurveyModel = {
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }],
    date: new Date('2023-10-05T12:34:56Z')
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
      }],
      date: new Date('2023-10-05T12:34:56Z')
    })
  })

  test('should return false when survey creation fails', async () => {
    surveyRepositoryStub.add.mockResolvedValue(false)
    const result = await dbSurvey.add(addSurvey)
    expect(result).toBe(false)
  })

  test('should handle add errors from the repository', async () => {
    surveyRepositoryStub.add.mockRejectedValue(new Error('Database error'))
    await expect(dbSurvey.add(addSurvey)).rejects.toThrow('Database error')
  })

  test('should return surveys when loadSurveys is successfull', async () => {
    const surveys = await dbSurvey.loadSurveys()
    expect(surveys).toEqual([
      {
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date('2023-10-05T12:34:56Z')
      },
      {
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date('2023-10-05T12:34:56Z')
      }
    ])
  })

  test('should call loadSurveys', async () => {
    await dbSurvey.loadSurveys()
    expect(surveyRepositoryStub.loadSurveys).toHaveBeenCalled()
  })

  test('should handle loadSurveys errors from the repository', async () => {
    surveyRepositoryStub.loadSurveys.mockRejectedValue(new Error('Database error'))
    await expect(dbSurvey.loadSurveys()).rejects.toThrow('Database error')
  })

  test('should return survey when loadById is successfull', async () => {
    const surveys = await dbSurvey.loadById('any_id')
    expect(surveys).toEqual({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date('2023-10-05T12:34:56Z')
    })
  })

  test('should call loadById with correct values', async () => {
    await dbSurvey.loadById('any_id')
    expect(surveyRepositoryStub.loadById).toHaveBeenCalledWith('any_id')
  })

  test('should handle loadSurveys errors from the repository', async () => {
    surveyRepositoryStub.loadById.mockRejectedValueOnce(new Error('Database error'))
    await expect(dbSurvey.loadById('any_id')).rejects.toThrow('Database error')
  })
})
