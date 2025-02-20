import { accountSchema } from './schemas/account-schema'
import { loginSchema } from './schemas/login-schema'
import { errorSchema } from './schemas/error-schema'
import { surveyAnswerSchema } from './schemas/surveyAnswerSchema'
import { surveySchema } from './schemas/surveySchema'
import { surveysSchema } from './schemas/surveysSchema'
import { apiKeyAuthSchema } from './schemas/api-key-auth-schema'
import { signupSchema } from './schemas/signupSchema'
import badRequestComponent from './components/bad-request-component'
import serverErrorComponent from './components/server-error-component'
import unauthorizedErrorComponent from './components/unauthorized-error-component'
import loginPath from './paths/login-path'
import surveysPath from './paths/surveys-path'
import forbiddenErrorComponent from './components/forbidden-error-component'
import signupPath from './paths/signup-path'
import { addSurveySchema } from './schemas/addSurveySchema'

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
    '/surveys': surveysPath,
    '/signup': signupPath
  },
  schemas: {
    accountSchema,
    loginSchema,
    errorSchema,
    surveySchema,
    surveysSchema,
    surveyAnswerSchema,
    signupSchema,
    addSurveySchema
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
