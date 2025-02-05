import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (httpRequest.body.name == null) {
      return badRequest(new MissingParamError('name'))
    }
    if (httpRequest.body.email == null) {
      return badRequest(new MissingParamError('email'))
    }
    return {
      statusCode: 404,
      body: new MissingParamError('No response')
    }
  }
}
