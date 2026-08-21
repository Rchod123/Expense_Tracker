import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useIsFocused,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from '../Components/TextComponent';
import BalanceCard from '../Components/BalanceCard';
import { useExit } from '../../utils/hooks';
import TransactionComp from '../Components/TransactionComponent';
import type { TransactionListItem } from '../Components/TransactionComponent';
import TransactionDetailsModal from '../Components/TransactionDetailsModal';
import type { MonthlySummary } from '../../types/domain';
import type { RootStackParamList } from '../../types/navigation';
import { useQuery } from '@realm/react';
import { Expense } from '../../db/schema/Expense';
import { useRealmData } from '../../utils/commonHooks';
import { useExpenseSync } from '../../utils/apiHooks';
import { useAuth } from '../../context/authContext';
import { getGreeting } from '../../utils/commonFunctions';
import { COLORS, STRINGS } from '../Constants';

const quickActions = [
  { label: STRINGS.home.addMoney, icon: 'plus', color: '#E2F5F1' },
  { label: STRINGS.home.send, icon: 'paper-plane', color: '#E8EEFF' },
  { label: STRINGS.home.payBill, icon: 'receipt', color: '#FFF0E5' },
] as const;

const HomePageScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const expense = useQuery(Expense)
    .filtered('userId == $0', user?.id ?? '')
    .sorted('date', true);

  const isFocused = useIsFocused();
  const { totalIncome } = useRealmData();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { runSync } = useExpenseSync();
  const { income, expenses } = totalIncome();
  const [summary, setSummary] = useState<MonthlySummary>({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionListItem | null>(null);

  useEffect(() => {
    void runSync();
  }, [isFocused, runSync]);

  useEffect(() => {
    setSummary({
      income,
      expenses,
      balance: income - expenses,
    });
  }, [income, expenses]);

  const balanceMenuFunction = (id: number) => {
    switch (id) {
      case 1: {
        runSync();
        return;
      }
      case 2: {
        navigation.navigate('Security');
        return;
      }
      default:
        return;
    }
  };

  useExit();
  const { greeting, emoji } = getGreeting();
  return (
    <View style={styles.screen}>
      <View style={[styles.hero, { paddingTop: Math.max(insets.top, 18) }]}>
        <View style={styles.heroContent}>
          <View style={styles.headerRow}>
            <View>
              <TextComponent
                value={`${greeting}${emoji}`}
                size="Small"
                color="#CBE5E1"
              />
              <TextComponent
                value={user?.name ?? ''}
                size="GMedium"
                variant="bold"
                color={COLORS.surface}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={styles.notificationButton}
            >
              <FontAwesome6
                name="bell"
                iconStyle="regular"
                size={19}
                color={COLORS.surface}
              />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>

          <BalanceCard
            balance={summary.balance}
            key={String(summary.balance + summary.income)}
            income={summary.income}
            expenses={summary.expenses}
            onPress={balanceMenuFunction}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 98, 118) },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View>
            <TextComponent
              value={STRINGS.home.quickActions}
              size="MMedium"
              variant="bold"
            />
            <TextComponent
              value={STRINGS.home.quickActionsSubtitle}
              size="ExtraSmall"
              color={COLORS.textMuted}
            />
          </View>
        </View>

        <View style={styles.actionRow}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('AddTransaction', {
                  type: action.label === STRINGS.home.addMoney ? 'income' : 'expense',
                })
              }
              style={styles.actionButton}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: action.color }]}
              >
                <FontAwesome6
                  name={action.icon}
                  iconStyle="solid"
                  size={16}
                  color="#176B65"
                />
              </View>
              <TextComponent
                value={action.label}
                size="ExtraSmall"
                variant="medium"
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <FontAwesome6
              name="chart-line"
              iconStyle="solid"
              size={16}
              color="#176B65"
            />
          </View>
          <View style={styles.insightText}>
            <TextComponent
              value={
                expense.length > 0
                  ? STRINGS.home.dashboardReady
                  : STRINGS.home.dashboardEmpty
              }
              size="Small"
              variant="bold"
            />
            <TextComponent
              value={
                expense.length > 0
                  ? STRINGS.home.dashboardReadySubtitle
                  : STRINGS.home.dashboardEmptySubtitle
              }
              size="ExtraSmall"
              color={COLORS.textSecondary}
            />
          </View>
          <FontAwesome6
            name="chevron-right"
            iconStyle="solid"
            size={12}
            color="#7D918F"
          />
        </View>

        <View style={styles.transactionsHeader}>
          <View>
            <TextComponent
              value={STRINGS.home.recentTransactions}
              size="MMedium"
              variant="bold"
            />
            <TextComponent
              value={STRINGS.home.recentTransactionsSubtitle}
              size="ExtraSmall"
              color={COLORS.textMuted}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => navigation.navigate('Transactions')}
          >
            <TextComponent
              value={STRINGS.home.seeAll}
              size="Small"
              variant="bold"
              color={COLORS.brandStrong}
            />
          </Pressable>
        </View>

        <View style={styles.transactionsCard}>
          <TransactionComp
            transactions={expense.slice(0, 4).map(item => ({
              ui: item.ui as keyof typeof import('../../assets').ImageAssets,
              title: item.title,
              type: item.type as any,
              amount: item.amount,
              description: item.description,
              date: item.date,
            }))}
            scrollEnabled={false}
            onPress={setSelectedTransaction}
          />
        </View>
      </ScrollView>
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F8F8' },
  hero: {
    backgroundColor: '#176B65',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  heroContent: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB078',
    borderWidth: 1.5,
    borderColor: '#176B65',
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: {
    flex: 1,
    minHeight: 104,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#21433F',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  actionIcon: {
    height: 40,
    width: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    gap: 12,
    backgroundColor: '#EAF6F3',
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#D1ECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: { flex: 1, gap: 3 },
  transactionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#21433F',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
      },
    }),
  },
});

export default HomePageScreen;
