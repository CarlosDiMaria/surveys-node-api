import { DbAddAccount } from '../../data/usecases/add-ccount/db-add-account'
import { DbLogErrorRepository } from '../../data/usecases/log-error/log-error'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log-controller-decorator'

export const makeSignUpController = (): Controller => {
  const addAccountMongoRepository = new AccountMongoRepository()
  const encrypter = new BcryptAdapter(12)
  const addAccount = new DbAddAccount(encrypter, addAccountMongoRepository)
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidator, addAccount)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  const logErrorRepository = new DbLogErrorRepository(logErrorMongoRepository)
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
