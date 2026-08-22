
export type TransactionType = 'income' | 'expense' | 'chat';

export type CurrencyCode = 'INR';

export type Category = {
  ui: "manCoinDonut" | "youtube" | "creditCard" | "payPal" | "netflix" | "amazon" | "outflow" | "transfer" | "inflow" | "moneyFlow" | "salary" | "interest" | "electricity" | "spotify" | "house";
  id: number;
  name: string;
  type: TransactionType;
  iconKey: string;
  color: string;
  createdAt: string;
};

export type CategoryDraft = Pick<Category, 'name' | 'type' | 'iconKey' | 'color'>;

export type Account = {
  id: number;
  name: string;
  currency: CurrencyCode;
  openingBalance: number;
  createdAt: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  tag: string;
  createdAt?: string;
}

export type Transaction = {
  ui: "manCoinDonut" | "youtube" | "creditCard" | "payPal" | "netflix" | "amazon" | "outflow" | "transfer" | "inflow" | "moneyFlow" | "salary" | "interest" | "electricity" | "spotify" | "house";
  id: number;
  title: string;
  type: TransactionType;
  amount: number;
  date: string;
  note: string | null;
};


export type MonthlySummary = {
  income: number;
  expenses: number;
  balance: number;
};
