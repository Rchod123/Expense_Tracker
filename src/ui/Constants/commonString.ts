type Category = {
  _id: number;
  name: string;
  ui: string;
  transactionType: string;
  type: string;
};

export const Categories: Array<Category> = [
  {
    _id: 1,
    name: 'Salary',
    ui: 'salary',
    transactionType: 'income',
    type: 'image',
  },
  {
    _id: 2,
    name: 'Interest',
    ui: 'interest',
    transactionType: 'income',
    type: 'image',
  },
  {
    _id: 3,
    name: 'shopping',
    ui: 'amazon',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 4,
    name: 'Entertainment',
    ui: 'youtube',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 5,
    name: 'Bills',
    ui: 'creditCard',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 6,
    name: 'Freelance',
    ui: 'moneyFlow',
    transactionType: 'income',
    type: 'image',
  },
  {
    _id: 7,
    name: 'Business',
    ui: 'inflow',
    transactionType: 'income',
    type: 'image',
  },
  {
    _id: 8,
    name: 'Investments',
    ui: 'interest',
    transactionType: 'income',
    type: 'image',
  },
  {
    _id: 9,
    name: 'Gifts',
    ui: 'outflow',
    transactionType: 'income',
    type: 'image',
  },
  {
    _id: 10,
    name: 'Food & Dining',
    ui: 'outflow',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 11,
    name: 'Transport',
    ui: 'transfer',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 12,
    name: 'Rent',
    ui: 'house',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 13,
    name: 'Subscriptions',
    ui: 'spotify',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 14,
    name: 'Healthcare',
    ui: 'outflow',
    transactionType: 'expense',
    type: 'image',
  },
  {
    _id: 15,
    name: 'Transfers',
    ui: 'transfer',
    transactionType: 'expense',
    type: 'image',
  },
];
