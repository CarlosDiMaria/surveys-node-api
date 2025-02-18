import { SurveyResultModel } from '../../domain/models/survey'
import { SaveSurveyResultModel } from '../../domain/usecases/survey'

export interface SurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
