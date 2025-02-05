export class SignUpController {
  handle (httpRequest: any): any {
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
  }
}
