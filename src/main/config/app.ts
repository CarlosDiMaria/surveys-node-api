import express from 'express'
import setUpMiddlewares from './middlewares'
import setUpRoutes from './routes'
import SetupSwagger from './config-swagger'

const app = express()
SetupSwagger(app)
setUpMiddlewares(app)
setUpRoutes(app)
export default app
