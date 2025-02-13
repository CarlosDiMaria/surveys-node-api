import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { ServerError } from '../erros'
import { AccessDeniedError } from '../erros/access-denied'
import { ok, serverError } from '../helpers/http-helper'
import { Middleware } from '../protocols/middleware'
import { AuthMiddleware } from './auth-middleware'

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  return {
    loadByToken: jest.fn().mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
  }
}

describe('Auth Middleware', () => {
  let loadAccountByTokenStub
  let sut: Middleware

  const noTokenHttpRequest = {
    headers: {}
  }

  const httpRequest = {
    headers: {
      'x-access-token': 'any_token'
    }
  }

  beforeEach(() => {
    loadAccountByTokenStub = makeLoadAccountByTokenStub()
    sut = new AuthMiddleware(loadAccountByTokenStub)
  })

  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { body, statusCode } = await sut.handle(noTokenHttpRequest)
    expect(body).toEqual(new AccessDeniedError())
    expect(statusCode).toEqual(403)
  })

  test('Should return 403 if no user is found with the token', async () => {
    loadAccountByTokenStub.loadByToken.mockReturnValueOnce(null)
    const { body, statusCode } = await sut.handle(httpRequest)
    expect(body).toEqual(new AccessDeniedError())
    expect(statusCode).toEqual(403)
  })

  test('Should call loadAccountByToken with correct access token', async () => {
    const role = 'any_role'
    sut = new AuthMiddleware(loadAccountByTokenStub, role)
    await sut.handle(httpRequest)
    expect(loadAccountByTokenStub.loadByToken).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 200 loadAccountByToken returns an account', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })

  test('Should return 500 if loadAccountByToken throws', async () => {
    loadAccountByTokenStub.loadByToken.mockRejectedValueOnce(new Error('Database error'))
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new ServerError('Database error')))
  })
})
