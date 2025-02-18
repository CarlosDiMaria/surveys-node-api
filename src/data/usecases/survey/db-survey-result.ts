import { SurveyResultModel } from '../../../domain/models/survey'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../domain/usecases/survey'
import { SurveyResultRepository } from '../../protocols/survey-result-repository'

export class DbSurveyResult implements SaveSurveyResult {
  constructor (private readonly surveyResultRepository: SurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const response = await this.surveyResultRepository.save(data)
    return response
  }
}
