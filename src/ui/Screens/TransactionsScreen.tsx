import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuery } from '@realm/react';
import { Expense } from '../../db/schema/Expense';
import { useAuth } from '../../context/authContext';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';
import ScreenHeader from '../Components/ScreenHeader';
import TransactionComp, { type TransactionListItem } from '../Components/TransactionComponent';
import TransactionDetailsModal from '../Components/TransactionDetailsModal';

const TransactionsScreen = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<TransactionListItem | null>(null);
  const expenses = useQuery(Expense).filtered('userId == $0', user?.id ?? '').sorted('date', true);
  const transactions = Array.from(expenses).map(item => ({
    id: item._id.toString(),
    ui: item.ui as TransactionListItem['ui'],
    title: item.title,
    type: item.type as TransactionListItem['type'],
    amount: item.amount,
    description: item.description,
    date: item.date,
  }));

  return (
    <View style={styles.screen}>
      <ScreenHeader value={STRINGS.transaction.title} required />
      <View style={styles.listCard}>
        <TransactionComp transactions={transactions} onPress={setSelected} />
      </View>
      <TransactionDetailsModal transaction={selected} onClose={() => setSelected(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surfaceMuted },
  listCard: { flex: 1, margin: SPACING.lg, paddingHorizontal: SPACING.md, borderRadius: RADIUS.xl, backgroundColor: COLORS.surface, ...SHADOWS.card },
});

export default TransactionsScreen;
