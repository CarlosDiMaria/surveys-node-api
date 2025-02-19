import { LoadSurveyById, SaveSurveyResult } from '../../../domain/usecases/survey'
import { InvalidParamError, ServerError } from '../../erros'
import { forbidden, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly dbSurveyResult: SaveSurveyResult,
    private readonly dbSurvey: LoadSurveyById
  ) { }

  async handle (httpRequest: HttpRequest): Promise <HttpResponse> {
    try {
      const { surveyId } = httpRequest?.params ?? {}
      const { answer } = httpRequest?.body ?? {}
      const { userId = 'Default' } = httpRequest
      const survey = await this.dbSurvey.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const date = new Date()
      const result = await this.dbSurveyResult.save({
        surveyId,
        userId,
        answer,
        date
      })
      return Promise.resolve(ok(result))
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
