import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter'
import { makeLoginController } from '../../factories/login'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  }
}
