import { LoadSurveyById, LoadSurveyResult } from '../../../domain/usecases/survey'
import { InvalidParamError, ServerError } from '../../erros'
import { forbidden, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly dbSurvey: LoadSurveyById,
    private readonly dbSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest?.params ?? {}
      const survey = await this.dbSurvey.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.dbSurveyResult.loadBySurveyId(surveyId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
