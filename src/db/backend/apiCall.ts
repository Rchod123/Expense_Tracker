import Realm, { BSON } from 'realm';
import { Expense } from '../schema/Expense';
import { Category } from '../schema/Categories';
import { categoriesApi, expensesApi, userApi } from '../../services/apiClient';
import { User } from '../schema/User';

interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedIds: string[];
  error?: string;
}

interface RemoteExpense {
  _id: string;
  title: string;
  amount: number;
  type?: string;
  ui?: string;
  category?: string;
  description?: string;
  date: string;
}

interface RemoteCategory {
  _id: string;
  name: string;
  ui: string;
  transactionType: string;
  type: string;
}

export const syncUnsyncedExpenses = async (
  realm: Realm,
  userId: string,
): Promise<SyncResult> => {
  const unsyncedExpenses = realm
    .objects(Expense)
    .filtered('userId == $0 AND synced == false', userId);

  if (unsyncedExpenses.length === 0) {
    return { success: true, syncedCount: 0, failedIds: [] };
  }
  const items = Array.from(unsyncedExpenses).map(item => ({
    _id: item._id.toString(),
    title: item.title,
    userId: item.userId,
    amount: item.amount,
    type: item.type,
    ui: item.ui,
    description: item.description,
    date: new Date(item.date).toDateString(),
  }));

  try {
    const { syncedIds = items.map(i => i._id) } = await expensesApi.sync(items);
    const syncedIdSet = new Set(syncedIds);

    realm.write(() => {
      unsyncedExpenses.forEach(exp => {
        if (syncedIdSet.has(exp._id.toString())) {
          exp.synced = true;
        }
      });
    });

    const failedIds = items.map(i => i._id).filter(id => !syncedIdSet.has(id));
    return {
      success: failedIds.length === 0,
      syncedCount: syncedIdSet.size,
      failedIds,
    };
  } catch (error) {
    console.error('Failed to sync expenses to MongoDB:', error);
    return {
      success: false,
      syncedCount: 0,
      failedIds: items.map(i => i._id),
      error: error instanceof Error ? error.message : 'Unknown sync error',
    };
  }
};

export const syncUnsyncedCategories = async (
  realm: Realm,
): Promise<SyncResult> => {
  const unsyncedCategories = realm
    .objects(Category)
    .filtered('synced == false');

  if (unsyncedCategories.length === 0) {
    return { success: true, syncedCount: 0, failedIds: [] };
  }

  const items = Array.from(unsyncedCategories).map(item => ({
    _id: item._id.toString(),
    name: item.name,
    ui: item.ui,
    transactionType: item.transactionType,
    type: item.type,
  }));

  try {
    const { syncedIds = items.map(i => i._id) } = await categoriesApi.sync(
      items,
    );
    const syncedIdSet = new Set(syncedIds);

    realm.write(() => {
      unsyncedCategories.forEach(cat => {
        if (syncedIdSet.has(cat._id.toString())) {
          cat.synced = true;
        }
      });
    });

    const failedIds = items.map(i => i._id).filter(id => !syncedIdSet.has(id));
    return {
      success: failedIds.length === 0,
      syncedCount: syncedIdSet.size,
      failedIds,
    };
  } catch (error) {
    console.error('Failed to sync categories to MongoDB:', error);
    return {
      success: false,
      syncedCount: 0,
      failedIds: items.map(i => i._id),
      error: error instanceof Error ? error.message : 'Unknown sync error',
    };
  }
};

export const pullExpensesFromMongo = async (
  realm: Realm,
  userId: string,
): Promise<SyncResult> => {
  try {
    const remoteExpenses = (await expensesApi.list()) as RemoteExpense[];
    realm.write(() => {
      remoteExpenses.forEach(remote => {
        const existing = realm.objectForPrimaryKey(
          Expense,
          new BSON.ObjectId(remote._id),
        );

        if (existing && !existing.synced) {
          return;
        }

        realm.create(
          Expense,
          {
            _id: new BSON.ObjectId(remote._id),
            title: remote.title,
            amount: remote.amount,
            userId: userId,
            type: remote.type ?? 'expense',
            description: remote.description,
            ui: remote.ui ?? remote.category ?? 'outflow',
            date: new Date(remote.date),
            synced: true,
          },
          Realm.UpdateMode.Modified,
        );
      });
    });

    return { success: true, syncedCount: remoteExpenses.length, failedIds: [] };
  } catch (error) {
    console.error('Failed to pull expenses from MongoDB:', error);
    return {
      success: false,
      syncedCount: 0,
      failedIds: [],
      error: error instanceof Error ? error.message : 'Unknown pull error',
    };
  }
};

export const pullCategoriesFromMongo = async (
  realm: Realm,
): Promise<SyncResult> => {
  try {
    const remoteCategories = (await categoriesApi.list()) as RemoteCategory[];

    realm.write(() => {
      remoteCategories.forEach(remote => {
        const existing = realm.objectForPrimaryKey(
          Category,
          new BSON.ObjectId(remote._id),
        );

        if (existing && !existing.synced) {
          return;
        }

        realm.create(
          Category,
          {
            _id: new BSON.ObjectId(remote._id),
            name: remote.name,
            ui: remote.ui,
            transactionType: remote.transactionType,
            type: remote.type ?? 'image',
            synced: true,
          },
          Realm.UpdateMode.Modified,
        );
      });
    });

    return {
      success: true,
      syncedCount: remoteCategories.length,
      failedIds: [],
    };
  } catch (error) {
    console.error('Failed to pull categories from MongoDB:', error);
    return {
      success: false,
      syncedCount: 0,
      failedIds: [],
      error: error instanceof Error ? error.message : 'Unknown pull error',
    };
  }
};

export const pullUserDetailsFromMongo = async (
  realm: Realm,
): Promise<SyncResult> => {
  try {
    const userDetails = await userApi.get();
    realm.write(() => {
      realm.create(
        User,
        {
          _id: new BSON.ObjectId(userDetails.id),
          name: userDetails.name,
          email: userDetails.email,
          mobile: userDetails.mobile,
          tag: userDetails.tag,
        },
        Realm.UpdateMode.Modified,
      );
    });
    return { success: true, syncedCount: 0, failedIds: [] };
  } catch (err) {
    return {
      success: false,
      syncedCount: 0,
      failedIds: [],
      error: err instanceof Error ? err.message : 'Unknown pull error',
    };
  }
};

// const pullUserDataFromMongo = async (): Promise<SyncResult> => {
//   try {
//     const response = await fetch(`${API_ENDPOINT}/user`);
//     if(!response.ok){
//       throw new Error(`User pull failed with the status ${response.status}`)
//     }

//     const remoteUser: RemoteUser = await response.json();

//   } catch (error) {
//     console.error('Failed to pull categories from MongoDB:', error);
//     return {
//       success: false,
//       syncedCount: 0,
//       failedIds: [],
//       error: error instanceof Error ? error.message : 'Unknown pull error',
//     };
//   }
// };

export const performFullSync = async (
  realm: Realm,
  userId: string,
): Promise<{ success: boolean; error?: string }> => {
  const pushExpenses = await syncUnsyncedExpenses(realm, userId);
  const pushCategories = await syncUnsyncedCategories(realm);
  const pullExpenses = await pullExpensesFromMongo(realm, userId);
  const pullCategories = await pullCategoriesFromMongo(realm);
  const userPull = await pullUserDetailsFromMongo(realm);

  const success =
    pushExpenses.success &&
    pushCategories.success &&
    pullExpenses.success &&
    userPull.success &&
    pullCategories.success;

  const error =
    pushExpenses.error ??
    pushCategories.error ??
    pullExpenses.error ??
    userPull.error ??
    pullCategories.error;

  return { success, error };
};
