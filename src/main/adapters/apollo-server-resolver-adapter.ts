import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'
import { Controller } from '../../presentation/protocols'

export const adaptResolver = async (controller: Controller, args?: any): Promise<any> => {
  const request = { ...(args ?? {}) }
  const httpResponse = await controller.handle({ body: request.body, params: request.params, userId: request?.userId })
  switch (httpResponse.statusCode) {
    case 200:
    case 204: return httpResponse.body
    case 400: throw new UserInputError(httpResponse.body.message)
    case 401: throw new AuthenticationError(httpResponse.body.message)
    case 403: throw new ForbiddenError(httpResponse.body.message)
    default: throw new ApolloError(httpResponse.body.message)
  }
}
