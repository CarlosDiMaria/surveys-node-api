import { Express, Router } from 'express'
import LoginRoutes from '../routes/login-routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  LoginRoutes(router)
}
