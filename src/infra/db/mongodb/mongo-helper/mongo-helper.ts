import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  mongoUrl: process.env.MONGO_URL ?? '',

  async connect (): Promise<void> {
    this.client = await MongoClient.connect(this.mongoUrl)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (data) {
    const { _id, ...rest } = data
    return { ...rest, id: data?._id.toHexString() ?? '' }
  }
}
