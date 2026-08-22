import Realm, { BSON } from 'realm';
import { UserType } from '../../types/domain';

export class User extends Realm.Object<UserType> {
  _id!: BSON.ObjectId;
  name!: string;
  mobile!: string;
  email!: string;
  tag!: string;
  synced!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      mobile: 'string',
      email: 'string',
      tag: 'string',
      synced: { type: 'bool', default: false },
    },
  };
};
