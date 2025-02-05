import { ObjectId } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export interface MongoAccountModel extends AccountModel {
  _id: ObjectId
}
