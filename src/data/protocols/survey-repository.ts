import { SurveyModel } from '../../domain/models/survey'
import { AddSurveyModel } from '../../domain/usecases/survey'

export interface SurveyRepository {
  add: (data: AddSurveyModel) => Promise<boolean>
  loadSurveys: () => Promise<SurveyModel[]>
  loadById: (id: string) => Promise<SurveyModel | null>
}
