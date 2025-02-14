import { SurveyModel } from '../../../domain/models/survey'
import { AddSurvey, AddSurveyModel, LoadSurvey } from '../../../domain/usecases/survey'
import { SurveyRepository } from '../../protocols/survey-repository'

export class DbSurvey implements AddSurvey, LoadSurvey {
  constructor (private readonly surveyRepository: SurveyRepository) {}

  async add (data: AddSurveyModel): Promise<boolean> {
    const isSurveyCreated = await this.surveyRepository.add(data)
    if (isSurveyCreated) return true
    return false
  }

  async loadSurveys (): Promise<SurveyModel[]> {
    return await this.surveyRepository.loadSurveys()
  }
}
