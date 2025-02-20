export default {
  get: {
    security: [{ apiKeyAuthSchema: [] }],
    tags: ['Surveys'],
    summary: 'API to list all user polls.',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveysSchema'
            }
          }
        }
      },
      500: {
        $ref: '#/components/serverErrorComponent'
      },
      403: {
        $ref: '#/components/forbiddenErrorComponent'
      }
    }
  },
  post: {
    security: [{ apiKeyAuthSchema: [] }],
    tags: ['Surveys'],
    summary: 'API to create a poll.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveySchema'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Sucesso'
      },
      400: {
        $ref: '#/components/badRequestComponent'
      },
      500: {
        $ref: '#/components/serverErrorComponent'
      },
      403: {
        $ref: '#/components/forbiddenErrorComponent'
      }
    }
  }
}
