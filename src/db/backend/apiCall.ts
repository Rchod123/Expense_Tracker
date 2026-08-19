import Realm, { BSON } from 'realm';
import { Expense } from '../schema/Expense';
import { Category } from '../schema/Categories';
import { getStoredToken } from '../../services/authStorage';

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
  date: string;
}

interface RemoteCategory {
  _id: string;
  name: string;
  ui: string;
  transactionType: string;
  type: string;
}

const parseSyncResponse = async (
  response: Response,
  fallbackIds: string[],
): Promise<{ syncedIds: string[] }> => {
  const result = await response.json();
  return { syncedIds: result.syncedIds ?? fallbackIds };
};

export const syncUnsyncedExpenses = async (
  realm: Realm,
  userId: string,
  apiEndpoint: string,
): Promise<SyncResult> => {
  const unsyncedExpenses = realm
    .objects(Expense)
    .filtered('userId == $0 AND synced == false', userId);
  const token = await getStoredToken();

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
    date: new Date(item.date).toDateString(),
  }));

  try {
    const response = await fetch(`${apiEndpoint}/expenses/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ expenses: items }),
    });

    if (!response.ok) {
      throw new Error(`Expense sync failed with status ${response.status}`);
    }

    const { syncedIds } = await parseSyncResponse(
      response,
      items.map(i => i._id),
    );
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
  apiEndpoint: string,
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
    const response = await fetch(`${apiEndpoint}/categories/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: items }),
    });

    if (!response.ok) {
      throw new Error(`Category sync failed with status ${response.status}`);
    }

    const { syncedIds } = await parseSyncResponse(
      response,
      items.map(i => i._id),
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
  apiEndpoint: string,
): Promise<SyncResult> => {
  const token = await getStoredToken();
  try {
    const response = await fetch(`${apiEndpoint}/expenses`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });


    if (!response.ok) {
      throw new Error(`Expense pull failed with status ${response.status}`);
    }

    const remoteExpenses: RemoteExpense[] = await response.json();
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
  apiEndpoint: string,
): Promise<SyncResult> => {
  try {
    const response = await fetch(`${apiEndpoint}/categories`);

    if (!response.ok) {
      throw new Error(`Category pull failed with status ${response.status}`);
    }

    const remoteCategories: RemoteCategory[] = await response.json();

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
  apiEndpoint: string,
): Promise<{ success: boolean; error?: string }> => {
  const pushExpenses = await syncUnsyncedExpenses(realm, userId, apiEndpoint);
  const pushCategories = await syncUnsyncedCategories(realm, apiEndpoint);
  const pullExpenses = await pullExpensesFromMongo(realm, userId, apiEndpoint);
  const pullCategories = await pullCategoriesFromMongo(realm, apiEndpoint);

  const success =
    pushExpenses.success &&
    pushCategories.success &&
    pullExpenses.success &&
    pullCategories.success;

  const error =
    pushExpenses.error ??
    pushCategories.error ??
    pullExpenses.error ??
    pullCategories.error;

  return { success, error };
};
