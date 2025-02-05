import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type EmailValidator
} from '../protocols'
import { badRequest, serverError } from '../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../erros/'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const email: string = httpRequest.body.email
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 404,
        body: new MissingParamError('No response')
      }
    } catch (e) {
      return serverError()
    }
  }
}
