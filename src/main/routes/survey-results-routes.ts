import { Router } from 'express'
import { makeAuthMiddleware } from '../factories/auth-middleware'
import { adaptRoute } from '../adapters/express-route-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeSaveSurveyResultController } from '../factories/save-ruvey-results'

export default (router: Router): void => {
  const userAuth = adaptMiddleware(makeAuthMiddleware())
  router.put('/survey/:surveyId/results', userAuth, adaptRoute(makeSaveSurveyResultController()))
}
