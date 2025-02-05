import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (mongoUrl: string): Promise<void> {
    this.client = await MongoClient.connect(mongoUrl)
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
