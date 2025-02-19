import { accountSchema } from './schemas/account-schema'
import { loginSchema } from './schemas/login-schema'

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
  tags: [{
    name: 'login'
  }],
  paths: {
    '/login': {
      post: {
        tags: ['login'],
        summary: 'API for user authentication.',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/schemas/loginSchema'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/schemas/accountSchema'
                }
              }
            }
          }
        }
      }
    }
  },
  schemas: {
    accountSchema,
    loginSchema
  }
}
