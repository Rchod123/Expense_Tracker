import { useQuery } from '@realm/react';
import { useMemo } from 'react';
import { Expense } from '../db/schema/Expense';
import { useAuth } from '../context/authContext';

export const useRealmData = () => {
  const { user } = useAuth();
  const expense = useQuery(Expense)
    .filtered('userId == $0', user?.id ?? '')
    .sorted('date', true);
  const totalIncome = () => {
    const incomeTransactions = expense.filtered("type == 'income'");
    const expenseTransactions = expense.filtered("type == 'expense'");
    const income = (incomeTransactions.sum('amount') as number) || 0;
    const expenses = (expenseTransactions.sum('amount') as number) || 0;
    return {
      income,
      expenses,
    };
  };

  const transactionData = () => {
    return expense;
  };

  return {
    totalIncome,
    transactionData,
  };
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

type ChartPoint = { value: number; label: string };

const toChartPoints = (
  transactions: Iterable<{ date: Date; amount: number }>,
  labels: string[],
  getLabel: (date: Date) => string,
): ChartPoint[] => {
  const totals = Object.fromEntries(labels.map(label => [label, 0]));
  for (const item of transactions) {
    const label = getLabel(new Date(item.date));
    if (label in totals) totals[label] += item.amount;
  }
  return labels.map(label => ({ value: totals[label], label }));
};

/**
 * 1. Weekly Data Hook (Current Week Mon-Sun)
 */
export const useWeeklyExpenseChart = () => {
  const { user } = useAuth();
  const startOfWeek = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon ...
    const diffToMon = (day + 6) % 7;

    const date = new Date(now);
    date.setDate(now.getDate() - diffToMon);
    date.setHours(0, 0, 0, 0); // Reset time to start of day

    return date; // MUST return a native Date object!
  }, []);

  const labels = DAYS.slice(1).concat(DAYS[0]);
  const expenses = useQuery(Expense).filtered(
    'userId == $0 AND date >= $1 AND type == $2',
    user?.id ?? '',
    startOfWeek,
    'expense',
  );
  const income = useQuery(Expense).filtered(
    'userId == $0 AND date >= $1 AND type == $2',
    user?.id ?? '',
    startOfWeek,
    'income',
  );

  return {
    data: toChartPoints(expenses, labels, date => DAYS[date.getDay()]),
    data2: toChartPoints(income, labels, date => DAYS[date.getDay()]),
  };
};

/**
 * 2. Monthly Data Hook (Current Year Jan-Dec)
 */
export const useMonthlyExpenseChart = () => {
  const { user } = useAuth();
  const { startOfYear, endOfYear } = useMemo(() => {
    const year = new Date().getFullYear();
    return {
      startOfYear: new Date(year, 0, 1, 0, 0, 0),
      endOfYear: new Date(year, 11, 31, 23, 59, 59),
    };
  }, []);

  const expenses = useQuery(Expense).filtered(
    'userId == $0 AND date >= $1 AND date <= $2 AND type == $3',
    user?.id ?? '',
    startOfYear,
    endOfYear,
    'expense',
  );
  const income = useQuery(Expense).filtered(
    'userId == $0 AND date >= $1 AND date <= $2 AND type == $3',
    user?.id ?? '',
    startOfYear,
    endOfYear,
    'income',
  );

  return {
    data: toChartPoints(expenses, MONTHS, date => MONTHS[date.getMonth()]),
    data2: toChartPoints(income, MONTHS, date => MONTHS[date.getMonth()]),
  };
};

/**
 * 3. Yearly Data Hook (All-time grouped by Year)
 */
export const useYearlyExpenseChart = () => {
  const { user } = useAuth();
  const expenses = useQuery(Expense).filtered('userId == $0', user?.id ?? '');

  return useMemo(() => {
    const totals: Record<string, number> = {};

    for (const item of expenses) {
      const year = new Date(item.date).getFullYear().toString();
      totals[year] = (totals[year] || 0) + item.amount;
    }

    return Object.keys(totals)
      .sort()
      .map(year => ({
        value: totals[year],
        label: year,
      }));
  }, [expenses]);
};
