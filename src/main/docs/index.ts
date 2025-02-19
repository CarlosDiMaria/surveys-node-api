import { accountSchema } from './schemas/account-schema'
import { loginSchema } from './schemas/login-schema'
import { errorSchema } from './schemas/error-schema'
import { surveyAnswerSchema } from './schemas/surveyAnswerSchema'
import { surveySchema } from './schemas/surveySchema'
import { surveysSchema } from './schemas/surveysSchema'
import badRequestComponent from './components/bad-request-component'
import serverErrorComponent from './components/server-error-component'
import unauthorizedErrorComponent from './components/unauthorized-error-component'
import loginPath from './paths/login-path'
import surveysPath from './paths/surveys-path'
import forbiddenErrorComponent from './components/forbidden-error-component'
import { apiKeyAuthSchema } from './schemas/api-key-auth-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Enquetes Node API',
    description: 'This is an API for creating polls among programmers.',
    version: '1.0.0'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    { name: 'Login' },
    { name: 'Enquete' }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveysPath
  },
  schemas: {
    accountSchema,
    loginSchema,
    errorSchema,
    surveySchema,
    surveysSchema,
    surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuthSchema
    },
    badRequestComponent,
    serverErrorComponent,
    unauthorizedErrorComponent,
    forbiddenErrorComponent
  }
}
