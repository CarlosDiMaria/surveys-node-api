import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: '' as string,

  async connect (mongoUrl: string): Promise<void> {
    this.uri = mongoUrl
    this.client = await MongoClient.connect(mongoUrl)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri)
    return this.client.db().collection(name)
  },

  map (data) {
    const { _id, ...rest } = data
    return { ...rest, id: data?._id.toHexString() ?? '' }
  }
}
