import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    load: [Survey!] @auth
  }

  type SurveyAnswerModel {
    image: String!
    answer: String!
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswerModel!]
    date: String!
  }
`
