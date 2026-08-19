import { useQuery } from '@realm/react';
import { useMemo } from 'react';
import { Expense } from '../db/schema/Expense';
import { useAuth } from '../context/authContext';

export const useRealmData = () => {
  const {user} = useAuth();
  const expense =useQuery(Expense).filtered('userId == $0', user?.id ?? "").sorted('date', true);
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

/**
 * 1. Weekly Data Hook (Current Week Mon-Sun)
 */
export const useWeeklyExpenseChart = () => {
  const startOfWeek = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon ...
    const diffToMon = (day + 6) % 7;

    const date = new Date(now);
    date.setDate(now.getDate() - diffToMon);
    date.setHours(0, 0, 0, 0); // Reset time to start of day

    return date; // MUST return a native Date object!
  }, []);

  const graphValueConversion = (expenses: any) => {
    const totals: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    for (const item of expenses) {
      const dayName = DAYS[new Date(item.date).getDay()];
      totals[dayName] = (totals[dayName] || 0) + item.amount;
    }

    return Object.keys(totals).map(day => ({
      value: totals[day] / 100,
      label: day,
    }));

    
  };

  

  // Filter using the Date object as $0
  const expenses = useQuery(Expense).filtered(
    'date >= $0 AND type == "expense"',
    startOfWeek,
  );
  const income = useQuery(Expense).filtered(
    'date >= $0 AND type == "income"',//"income"
    startOfWeek,
  );

  return {
    data: graphValueConversion(expenses),
    data2: graphValueConversion(income)
  }
};

/**
 * 2. Monthly Data Hook (Current Year Jan-Dec)
 */
export const useMonthlyExpenseChart = () => {
  const { startOfYear, endOfYear } = useMemo(() => {
    const year = new Date().getFullYear();
    return {
      startOfYear: new Date(year, 0, 1, 0, 0, 0),
      endOfYear: new Date(year, 11, 31, 23, 59, 59),
    };
  }, []);

  const graphValueConversion = (expense:any) => {
    const totals = MONTHS.reduce(
      (acc, month) => ({ ...acc, [month]: 0 }),
      {} as Record<string, number>,
    );

    for (const item of expense) {
      const monthName = MONTHS[new Date(item.date).getMonth()];
      totals[monthName] += item.amount;
    }

    return Object.keys(totals).map(month => ({
      value: totals[month] / 100,
      label: month,
    }));
  }

  // Live Query filtered for current year
  const expenses = useQuery(Expense).filtered(
    'date >= $0 AND date <= $1 AND type == $2',
    startOfYear,
    endOfYear,
    'expense'
  );
  const income = useQuery(Expense).filtered(
    'date >= $0 AND date <= $1 AND type == $2',
    startOfYear,
    endOfYear,
    'income'
  );

  return {
    data: graphValueConversion(expenses),
    date2: graphValueConversion(income)
  }
};

/**
 * 3. Yearly Data Hook (All-time grouped by Year)
 */
export const useYearlyExpenseChart = () => {
  // Query all expenses
  const expenses = useQuery(Expense);

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
