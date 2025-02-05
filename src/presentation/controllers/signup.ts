import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { MissingParamError } from '../erros/missingParamError'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (httpRequest.body.name == null) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (httpRequest.body.email == null) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
    return {
      statusCode: 404,
      body: new MissingParamError('No response')
    }
  }
}
