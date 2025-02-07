import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error-repository/log-error'
import { LogErrorRepository } from '../../protocols/log-error-repository'

export class DbLogErrorRepository implements LogErrorRepository {
  logErrorMongoRepository: LogErrorMongoRepository

  constructor (logErrorMongoRepository: LogErrorMongoRepository) {
    this.logErrorMongoRepository = logErrorMongoRepository
  }

  async log (stack: string): Promise<void> {
    this.logErrorMongoRepository.log(stack)
  }
}
