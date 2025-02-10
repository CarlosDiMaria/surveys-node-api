import { Router } from 'express'
import { makeSignUpController } from '../factories/signup'
import { makeLoginController } from '../factories/login'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
