import Realm,{ BSON} from 'realm';

export class Task extends Realm.Object<Task>{
    _id!: BSON.ObjectId;
    name!: string;
    amount!: string;
    type!: string;
    date!: Date;
    static schema : Realm.ObjectSchema = {
        name: 'Task',
        primaryKey : '_id',
        properties:{
            _id: 'objectId',
            name: 'string',
            amount: 'string',
            type: 'string',
            date: {
                type: 'date',
                default: () => new Date()
            },
        },
    };
}