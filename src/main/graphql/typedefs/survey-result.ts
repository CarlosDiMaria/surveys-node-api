import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    loadBySurveyId (surveyId: String!): SurveyResultModel! @auth
  }

  extend type Mutation {
    save (data: SaveSurveyResultInput!): SurveyResultModel! @auth
  }

  input SaveSurveyResultInput {
    surveyId: String!
    userId: String!
    answer: String!
    date: String!
  }

  type SurveyResultAnswerModel {
    answer: String!
    count: Int!
    percent: Float!
  }

  type SurveyResultModel {
    surveyId: String!
    question: String!
    answers: [SurveyResultAnswerModel]
    date: String!
  }
`
