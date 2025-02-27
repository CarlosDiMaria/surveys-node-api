import { ForbiddenError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'
import { makeAuthMiddleware } from '../../factories/auth-middleware'
import { HttpRequest, HttpResponse } from '../../../presentation/protocols'
import { mapSchema, MapperKind } from '@graphql-tools/utils'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthDirective {
  static transformSchema (schema): any {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const authDirective = fieldConfig.astNode?.directives?.find(
          (directive) => directive.name.value === 'auth'
        )
        if (authDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig
          fieldConfig.resolve = async (parent, args, context, info) => {
            const httpRequest: HttpRequest = {
              headers: {
                'x-access-token': context?.req?.headers?.['x-access-token']
              }
            }
            const httpResponse: HttpResponse = await makeAuthMiddleware().handle(httpRequest)
            if (httpResponse.statusCode === 200) {
              Object.assign(context?.req, httpResponse.body)
              return resolve(parent, args, context, info)
            } else {
              throw new ForbiddenError(httpResponse.body.message)
            }
          }
        }
        return fieldConfig
      }
    })
  }
}
