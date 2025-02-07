import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../../protocols'
import { LoginController } from './login'

describe('LoginController', () => {
  interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
  }

  const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    class AuthenticationStub implements Authentication {
      async auth (email: string, password: string): Promise<string | null> {
        return new Promise(resolve => resolve('any_token'))
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const authenticationStub = new AuthenticationStub()
    const sut = new LoginController(emailValidatorStub, authenticationStub)
    return {
      sut,
      emailValidatorStub,
      authenticationStub
    }
  }

  const httpValidLoginRequest: HttpRequest = {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpLoginRequest: HttpRequest = {
      body: {
        email: '',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpLoginRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpLoginRequest: HttpRequest = {
      body: {
        email: 'any_email',
        password: ''
      }
    }
    const httpResponse = await sut.handle(httpLoginRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should call email validator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpValidLoginRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpLoginRequest: HttpRequest = {
      body: {
        email: 'invalid_email',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpLoginRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(httpValidLoginRequest)
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    expect(response).toEqual(serverError(fakeError))
  })

  test('Should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(httpValidLoginRequest)
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })

  test('Should return unauthorized if auth returns no token', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.handle(httpValidLoginRequest)
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(httpValidLoginRequest)
    const fakeError = new Error()
    expect(response).toEqual(serverError(fakeError))
  })

  test('Should return token on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(httpValidLoginRequest)
    expect(response).toEqual(ok({ accessToken: 'any_token' }))
  })
})
