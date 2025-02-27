import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLError } from 'graphql'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/typedefs'
import AuthDirective from '../graphql/directives/index'

const handleErrors = (response: any, errors: readonly GraphQLError[] | undefined): void => {
  errors?.forEach(error => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) response.http.status = 400
    if (checkError(error, 'AuthenticationError')) response.http.status = 401
    if (checkError(error, 'ForbiddenError')) response.http.status = 403
    if (checkError(error, 'ApolloError')) response.http.status = 500
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean =>
  [error.name, error.originalError?.name].some(name => name === errorName)

const applyDirectives = (schema): any => {
  return AuthDirective.transformSchema(schema) // Apply the AuthDirective
}

export default async (app: Express): Promise<void> => {
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })
  schema = applyDirectives(schema)

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
        })
      }
    ]
  })

  await server.start()
  server.applyMiddleware({ app })
}
