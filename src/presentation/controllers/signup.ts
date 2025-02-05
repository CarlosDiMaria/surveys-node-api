import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (httpRequest.body.name == null) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if (httpRequest.body.email == null) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
    return {
      statusCode: 404,
      body: new Error('No response')
    }
  }
}
