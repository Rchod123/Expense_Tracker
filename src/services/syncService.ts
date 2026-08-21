// services/syncService.ts
import { expensesApi } from './apiClient';

export const syncUnsyncedExpenses = async (realm: Realm, _apiEndpoint: string) => {
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

    await expensesApi.sync(payload.map(item => ({
      ...item,
      type: 'expense',
      ui: item.category,
      description: '',
      date: new Date().toISOString(),
    })));
    realm.write(() => {
      unsyncedExpenses.forEach((exp: any) => {
        exp.synced = true;
      });
    });
  } catch (error) {
    console.error('Failed to sync expenses:', error);
  }
};
