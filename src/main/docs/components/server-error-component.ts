export default {
  description: 'Server Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/errorSchema'
      }
    }
  }
}
