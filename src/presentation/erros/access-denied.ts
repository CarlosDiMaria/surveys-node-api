export class AccessDeniedError extends Error {
  constructor () {
    super('Access Denied error')
    this.name = 'Access Denied'
  }
}
