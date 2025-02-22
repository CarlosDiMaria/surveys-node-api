import { Router } from 'express'
import { makeAuthMiddleware } from '../factories/auth-middleware'
import { adaptRoute } from '../adapters/express-route-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeSaveSurveyResultController } from '../factories/save-ruvey-results'
import { makeLoadSurveyResultController } from '../factories/load-ruvey-results'

export default (router: Router): void => {
  const userAuth = adaptMiddleware(makeAuthMiddleware())
  router.put('/surveys/:surveyId/results', userAuth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', userAuth, adaptRoute(makeLoadSurveyResultController()))
}
