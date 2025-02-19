export default {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/errorSchema'
      }
    }
  }
}
