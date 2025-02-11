import env from '../config/env'
import { DbAddAccount } from '../../data/usecases/add-ccount/db-add-account'
import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { DbLogErrorRepository } from '../../data/usecases/log-error/log-error'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'

export const makeSignUpController = (): Controller => {
  const addAccountMongoRepository = new AccountMongoRepository()
  const hasher = new BcryptAdapter(12)
  const addAccount = new DbAddAccount(hasher, addAccountMongoRepository)
  const emailValidator = new EmailValidatorAdapter()
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(loadAccountByEmailRepository, hasher, tokenGenerator, loadAccountByEmailRepository)
  const signUpController = new SignUpController(emailValidator, addAccount, authentication)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  const logErrorRepository = new DbLogErrorRepository(logErrorMongoRepository)
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
