import { MongoHelper } from '../infra/db/mongodb/mongo-helper/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log(`server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
