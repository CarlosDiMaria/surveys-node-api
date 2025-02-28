import { adaptResolver } from '../../adapters/apollo-server-resolver-adapter'
import { makeLoadSurveyResultController } from '../../factories/load-ruvey-results'
import { makeSaveSurveyResultController } from '../../factories/save-ruvey-results'

export default {
  Query: {
    loadBySurveyId: async (parent: any, args: any) => adaptResolver(makeLoadSurveyResultController(), { params: args })
  },
  Mutation: {
    save: async (parent: any, args: any) => {
      const { surveyId, userId, ...rest } = args?.data
      return adaptResolver(makeSaveSurveyResultController(), { body: { ...rest }, params: { surveyId }, userId })
    }
  }
}
