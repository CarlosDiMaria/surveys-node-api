import { Router } from 'express'
import { makeAuthMiddleware } from '../factories/auth-middleware'
import { adaptRoute } from '../adapters/express-route-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAddSurveyController } from '../factories/add-survey'
import { makeLoadSurveyController } from '../factories/load-surveys'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const userAuth = adaptMiddleware(makeAuthMiddleware())
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveyController()))
}
