import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/typedefs'

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })
  await server.start()
  server.applyMiddleware({ app })
}
