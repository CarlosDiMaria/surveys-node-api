import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { LoadSurvey } from '../../../domain/usecases/survey'
import { ok, serverError } from '../../helpers/http-helper'

export class LoadSurveyController implements Controller {
  constructor (private readonly dbSurvey: LoadSurvey) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.dbSurvey.loadSurveys()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
