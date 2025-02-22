import { DbLogErrorRepository } from '../../data/usecases/log-error/log-error'
import { DbSurvey } from '../../data/usecases/survey/db-survey'
import { DbSurveyResult } from '../../data/usecases/survey/db-survey-result'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { SurveyMongoRepository } from '../../infra/db/mongodb/survey-repository/survey-repository'
import { SurveyResultMongoRepository } from '../../infra/db/mongodb/survey-result-repository/survey-result-repository'
import { LoadSurveyResultController } from '../../presentation/controllers/survey-result/load-survey-result'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'

export const makeLoadSurveyResultController = (): Controller => {
  const dbSurveyResultMongoRepository = new SurveyResultMongoRepository()
  const dbSurveyResult = new DbSurveyResult(dbSurveyResultMongoRepository)
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbSurvey = new DbSurvey(surveyMongoRepository)
  const saveSurveyResultController = new LoadSurveyResultController(dbSurvey, dbSurveyResult)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  const logErrorRepository = new DbLogErrorRepository(logErrorMongoRepository)
  return new LogControllerDecorator(saveSurveyResultController, logErrorRepository)
}
