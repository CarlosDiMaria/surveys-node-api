import { Express, Router } from 'express'
import LoginRoutes from '../routes/login-routes'
import SurveyRoutes from '../routes/survey-routes'
import SurveyResultsRoutes from '../routes/survey-results-routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  LoginRoutes(router)
  SurveyRoutes(router)
  SurveyResultsRoutes(router)
}
