import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/survey'
import { AddSurveyRepository } from '../../protocols/survey-repository'

export class DbSurvey implements AddSurvey {
  constructor (private readonly surveyRepository: AddSurveyRepository) {}

  async add (data: AddSurveyModel): Promise<boolean> {
    const isSurveyCreated = await this.surveyRepository.add(data)
    if (isSurveyCreated) return true
    return false
  }
}
