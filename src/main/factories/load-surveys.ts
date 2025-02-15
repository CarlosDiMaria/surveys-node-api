import { DbLogErrorRepository } from '../../data/usecases/log-error/log-error'
import { DbSurvey } from '../../data/usecases/survey/db-survey'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { SurveyMongoRepository } from '../../infra/db/mongodb/survey-repository/survey-repository'
import { LoadSurveyController } from '../../presentation/controllers/survey/load-surveys'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'

export const makeLoadSurveyController = (): Controller => {
  const dbSurveyMongoRepository = new SurveyMongoRepository()
  const dbSurvey = new DbSurvey(dbSurveyMongoRepository)
  const loadSurveyController = new LoadSurveyController(dbSurvey)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  const logErrorRepository = new DbLogErrorRepository(logErrorMongoRepository)
  return new LogControllerDecorator(loadSurveyController, logErrorRepository)
}
