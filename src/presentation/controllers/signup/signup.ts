import { AddAccount, EmailValidator, HttpRequest, HttpResponse, Controller } from '../../controllers/signup/signup-protocols'
import { badRequest, serverError, ok, unauthorized } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../erros'
import { Authentication } from '../../../domain/usecases/authentication'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('password confirmation is incorrect'))
      }
      await this.addAccount.add({
        name,
        email,
        password
      })
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) return unauthorized()
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
