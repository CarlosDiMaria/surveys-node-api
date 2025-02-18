export interface SurveyAnswerModel {
  image: string
  answer: string
}

export interface SurveyModel {
  id?: string
  question: string
  answers: SurveyAnswerModel[]
}

export interface SurveyResultModel {
  id: string
  surveyId: string
  userId: string
  answer: string
  date: Date
}
