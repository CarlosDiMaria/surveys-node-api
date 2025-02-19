export default {
  post: {
    tags: ['Login'],
    summary: 'API for user sign up.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signupSchema'
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
