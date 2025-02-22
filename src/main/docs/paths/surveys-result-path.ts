export default {
  put: {
    security: [{ apiKeyAuthSchema: [] }],
    tags: ['Surveys'],
    summary: 'API to answer a survey poll.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyResultParamsSchema'
          }
        }
      }
    },
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultSchema'
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
  get: {
    security: [{ apiKeyAuthSchema: [] }],
    tags: ['Surveys'],
    summary: 'API to load the answers of a survey poll.',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultSchema'
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
  }
}
