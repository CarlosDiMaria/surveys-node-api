import { Router } from 'express'
import { makeAuthMiddleware } from '../factories/auth-middleware'
import { adaptRoute } from '../adapters/express-route-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAddSurveyController } from '../factories/add-survey'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
}
