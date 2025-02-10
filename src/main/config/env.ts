export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/enquetes-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'St@M@r1@MA3D3DEUS333'
}
