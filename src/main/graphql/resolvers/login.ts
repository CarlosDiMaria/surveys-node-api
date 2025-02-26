import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter'
import { makeLoginController } from '../../factories/login'
import { makeSignUpController } from '../../factories/signup'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  },
  Mutation: {
    signUp: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args)
  }
}
