import { DbLoadAccountByToken } from '../../data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { AuthMiddleware } from '../../presentation/middlewares/auth-middleware'
import { Middleware } from '../../presentation/protocols/middleware'
import env from '../config/env'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  const dbLoadAccountByToken = new DbLoadAccountByToken(jwtAdapter, loadAccountByTokenRepository)
  const authMiddleware = new AuthMiddleware(dbLoadAccountByToken, role)
  return authMiddleware
}
