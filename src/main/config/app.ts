import express from 'express'
import setUpMiddlewares from './middlewares'
import setUpRoutes from './routes'
import setupSwagger from './config-swagger'
import setupApolloServer from './apollo-server'

const app = express()
setupApolloServer(app)
setupSwagger(app)
setUpMiddlewares(app)
setUpRoutes(app)
export default app
