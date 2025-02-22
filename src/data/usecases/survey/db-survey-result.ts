import { SurveyResultModel } from '../../../domain/models/survey'
import { LoadSurveyResult, SaveSurveyResult, SaveSurveyResultModel } from '../../../domain/usecases/survey'
import { SurveyResultRepository } from '../../protocols/survey-result-repository'

export class DbSurveyResult implements SaveSurveyResult, LoadSurveyResult {
  constructor (private readonly surveyResultRepository: SurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const response = await this.surveyResultRepository.save(data)
    return response
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const response = await this.surveyResultRepository.loadBySurveyId(surveyId)
    return response
  }
}
