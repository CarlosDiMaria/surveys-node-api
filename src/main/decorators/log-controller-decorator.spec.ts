import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

describe('LogControllerDecorator', () => {
  interface SutTypes {
    controllerStub: Controller
    sut: LogControllerDecorator
    logErrorRepositoryStub: LogErrorRepository
  }

  const makeSut = (): SutTypes => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return Promise.resolve({ statusCode: 200, body: {} })
      }
    }
    class LogErrorRepositoryStub implements LogErrorRepository {
      async log (stack: string): Promise<void> {

      }
    }
    const logErrorRepositoryStub = new LogErrorRepositoryStub()
    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
      controllerStub,
      sut,
      logErrorRepositoryStub
    }
  }

  const httpRequest: HttpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  test('Ensure LogControllerDecorator calls Controller handle method', () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Ensure LogControllerDecorator handle returns same result of Controller', async () => {
    const { controllerStub, sut } = makeSut()
    const controllerResponse = await controllerStub.handle(httpRequest)
    const logControllerResponse = await sut.handle(httpRequest)
    expect(controllerResponse).toEqual(logControllerResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { controllerStub, sut, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
