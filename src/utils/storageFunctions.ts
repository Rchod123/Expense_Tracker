import { useRealm } from '@realm/react';
import { BSON } from 'realm';
import { Category } from '../db/schema/Categories';
import { Expense } from '../db/schema/Expense';
import { useAuth } from '../context/authContext';

export const useRealmServices = () => {
  const realm = useRealm();
  const {user} = useAuth();

  const clearStorage = () => {
    try {
      realm.write(() => {
        realm.deleteAll();
      });
      console.log('Database wiped successfully');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  };

  const createCategory = (data: {
    name: string;
    ui: string;
    transactionType: string;
    type: string;
  }) => {
    realm.write(() => {
      realm.create(Category, {
        _id: new BSON.ObjectId(),
        
        name: data.name,
        ui: data.ui,
        transactionType: data.transactionType,
        type: data.type,
        synced: false,
      });
    });
  };

  const createExpense = (data: {
    title: string;
    amount: number;
    category: string;
    date: string;
    ui: string;
  }) => {
    try {
      let newExpense;
      realm.write(() => {
        newExpense = realm.create(Expense, {
          _id: new BSON.ObjectId(),
          title: data.title,
          userId: user.id, // 👈 Save local record under active userId
          amount: Number(data.amount),
          type: data.category,
          ui: data.ui,
          date: new Date(data.date),
          synced: false,
        });
      });
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const updateExpense = (
    expenseId: BSON.ObjectId | string,
    updates: Partial<Expense>
  ) => {
    try {
      const targetId =
        typeof expenseId === 'string'
          ? new BSON.ObjectId(expenseId)
          : expenseId;

      const existingExpense = realm.objectForPrimaryKey(Expense, targetId);

      if (!existingExpense) {
        console.warn('Expense not found for update');
        return;
      }

      realm.write(() => {
        Object.assign(existingExpense, updates, { synced: false });
      });
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const deleteById = (id: BSON.ObjectId | string) => {
    try {
      const targetId = typeof id === 'string' ? new BSON.ObjectId(id) : id;
      const itemToDelete = realm.objectForPrimaryKey(Expense, targetId);

      if (itemToDelete) {
        realm.write(() => {
          realm.delete(itemToDelete);
        });
      }
    } catch (error) {
      console.error('Error deleting object:', error);
    }
  };

  const markAsSynced = (ids: string[]) => {
    try {
      realm.write(() => {
        ids.forEach((id) => {
          const item = realm.objectForPrimaryKey(
            Expense,
            new BSON.ObjectId(id)
          );
          if (item) {
            item.synced = true;
          }
        });
      });
    } catch (error) {
      console.error('Error updating sync status:', error);
    }
  };

  return {
    clearStorage,
    createExpense,
    updateExpense,
    createCategory,
    deleteById,
    markAsSynced,
  };
};
