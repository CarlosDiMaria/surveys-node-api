import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter'
import { makeLoadSurveyController } from '../../factories/load-surveys'

export default {
  Query: {
    load: async (parent: any, args: any) => adaptResolver(makeLoadSurveyController(), { body: args })
  }
}
