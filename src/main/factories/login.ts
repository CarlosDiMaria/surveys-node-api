import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { DbLogErrorRepository } from '../../data/usecases/log-error/log-error'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { LoginController } from '../../presentation/controllers/login/login'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import env from '../config/env'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'

export const makeLoginController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(loadAccountByEmailRepository, hashComparer, tokenGenerator, loadAccountByEmailRepository)
  const signUpController = new LoginController(emailValidator, authentication)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  const logErrorRepository = new DbLogErrorRepository(logErrorMongoRepository)
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
