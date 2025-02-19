export default {
  post: {
    tags: ['Login'],
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
      },
      400: {
        $ref: '#/components/badRequestComponent'
      },
      500: {
        $ref: '#/components/serverErrorComponent'
      },
      401: {
        $ref: '#/components/unauthorizedErrorComponent'
      }
    }
  }
}
