import { SurveyModel, SurveyResultModel } from '../models/survey'

export interface SurveyAnswer {
  image: string
  answer: string
}

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<boolean>
}

export interface LoadSurvey {
  loadSurveys: () => Promise<SurveyModel[]>
}

export interface LoadSurveyById {
  loadById: (id: string) => Promise<SurveyModel | null>
}

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
