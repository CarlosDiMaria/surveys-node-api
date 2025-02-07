import { LogErrorRepository } from '../../protocols/log-error-repository'
import { DbLogErrorRepository } from './log-error'

describe('LogError UseCase', () => {
  test('Log Should be called with correct param', async () => {
    class LogErrorMongoRepositoryStub implements LogErrorRepository {
      async log (stack: string): Promise<void> { }
    }
    const dbLogErroRepositoryStub = new LogErrorMongoRepositoryStub()
    const sut = new DbLogErrorRepository(dbLogErroRepositoryStub)
    const logSpy = jest.spyOn(dbLogErroRepositoryStub, 'log')
    sut.log('any_stack')
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
