import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest, serverError } from '../helpers/http-helper'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../erros/invalid-param-error'

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
