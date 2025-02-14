import { MissingParamError, ServerError } from '../../erros'
import { badRequest, noContentOk, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { AddSurvey } from '../../../domain/usecases/survey'

export class AddSurveyController implements Controller {
  constructor (private readonly dbSurvey: AddSurvey) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { question, answers } = httpRequest?.body ?? {}
      if (!question) {
        return badRequest(new MissingParamError('question'))
      }
      if (!Array.isArray(answers) || answers.some(a => !a?.answer)) {
        return badRequest(new MissingParamError('answer'))
      }
      const isSurveyCreated = await this.dbSurvey.add({
        question,
        answers,
        date: new Date()
      })
      return isSurveyCreated ? noContentOk() : serverError(new ServerError('survey not created'))
    } catch (error) {
      return serverError(new ServerError(error.message || 'Internal server error'))
    }
  }
}
