// models/Expense.ts
import Realm, { BSON } from 'realm';
import { Transaction } from '../../types/domain';

export class Expense extends Realm.Object<Transaction[]> {
  _id!: BSON.ObjectId;
  title!: string;
  userId!: string;
  amount!: number;
  type!: string;
  ui!: string;
  date!: Date;
  synced!: boolean; // Used to track offline-to-online sync status

  static schema: Realm.ObjectSchema = {
    name: 'Expense',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      title: 'string',
      amount: 'double',
      ui: 'string',
      type: 'string',
      date: 'date',
      synced: { type: 'bool', default: false },
    },
  };
};