import { Router } from 'express'
import { makeAddSurveyController } from '../factories/add-survey'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/survey', adaptRoute(makeAddSurveyController()))
}
