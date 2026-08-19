import Realm, { BSON } from 'realm';

export class Category extends Realm.Object<Category> {
  _id!: BSON.ObjectId;
  name!: string;
  ui!: string;
  transactionType!: string;
  type!: string;
  synced!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Category',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      ui: 'string',
      transactionType: 'string',
      type: 'string',
      synced: { type: 'bool', default: true },
    },
  };
}
