// services/syncService.ts
import { getStoredToken } from './authStorage';

export const syncUnsyncedExpenses = async (realm: Realm, apiEndpoint: string) => {
  const token = await getStoredToken();
  if (!token) return; // Must be authenticated to sync

  const unsyncedExpenses = realm.objects('Expense').filtered('synced == false');
  if (unsyncedExpenses.length === 0) return;

  try {
    const payload = unsyncedExpenses.map((item: any) => ({
      _id: item._id.toString(),
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: item.date,
    }));

    const response = await fetch(`${apiEndpoint}/expenses/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass Auth Header
      },
      body: JSON.stringify({ expenses: payload }),
    });

    if (response.ok) {
      realm.write(() => {
        unsyncedExpenses.forEach((exp: any) => {
          exp.synced = true;
        });
      });
    }
  } catch (error) {
    console.error('Failed to sync expenses:', error);
  }
};