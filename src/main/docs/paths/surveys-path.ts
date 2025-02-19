export default {
  get: {
    security: [{ apiKeyAuthSchema: [] }],
    tags: ['Enquete'],
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
  }
}
