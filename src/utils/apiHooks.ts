import { useEffect, useRef, useCallback, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useRealm, useQuery } from '@realm/react';
import { Expense } from '../db/schema/Expense';

import { performFullSync } from '../db/backend/apiCall';
import { useAuth } from '../context/authContext';

export const useExpenseSync = () => {
  const realm = useRealm();
  const {user, token} = useAuth();
  const unsyncedExpenses = useQuery(Expense).filtered(
    'userId == $0 AND synced == false',
    user?.id ?? '',
  );

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const isSyncingRef = useRef(false);

  const runSync = useCallback(async () => {
    if (isSyncingRef.current) return;
    if (!user?.id || !token) return;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected || netState.isInternetReachable === false) return;

    isSyncingRef.current = true;
    setIsSyncing(true);
    setLastError(null);
    try {
      const result = await performFullSync(realm, user.id);
      if (!result.success) {
        setLastError(result.error ?? 'Sync failed');
      }
    } catch (error) {
      setLastError(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [realm, token, user?.id]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        runSync();
      }
    });
    return () => unsubscribe();
  }, [runSync]);

  useEffect(() => {
    runSync();
  }, [runSync]);

  return {
    pendingCount: unsyncedExpenses.length,
    isSyncing,
    lastError,
    runSync,
  };
};
