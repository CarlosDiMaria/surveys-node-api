export class ConflictError extends Error {
  constructor (conflictName: string) {
    super(`${conflictName}`)
  }
}
