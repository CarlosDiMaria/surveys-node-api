type SurveyAnswerModel = {
  image: string
  answer: string
}

type SurveyResultAnswerModel = SurveyAnswerModel & {
  count: number
  percent: number
}

export interface SurveyModel {
  id?: string
  question: string
  answers: SurveyAnswerModel[]
}

export interface SurveyResultModel {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}
