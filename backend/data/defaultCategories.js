// Stable ObjectId strings so mobile and server share the same category ids.
const DEFAULT_CATEGORIES = [
  { _id: '665a10000000000000000001', name: 'Salary', ui: 'salary', transactionType: 'income', type: 'image' },
  { _id: '665a10000000000000000002', name: 'Interest', ui: 'interest', transactionType: 'income', type: 'image' },
  { _id: '665a10000000000000000003', name: 'shopping', ui: 'amazon', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000004', name: 'Entertainment', ui: 'youtube', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000005', name: 'Bills', ui: 'creditCard', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000006', name: 'Freelance', ui: 'moneyFlow', transactionType: 'income', type: 'image' },
  { _id: '665a10000000000000000007', name: 'Business', ui: 'inflow', transactionType: 'income', type: 'image' },
  { _id: '665a10000000000000000008', name: 'Investments', ui: 'interest', transactionType: 'income', type: 'image' },
  { _id: '665a10000000000000000009', name: 'Gifts', ui: 'outflow', transactionType: 'income', type: 'image' },
  { _id: '665a10000000000000000010', name: 'Food & Dining', ui: 'outflow', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000011', name: 'Transport', ui: 'transfer', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000012', name: 'Rent', ui: 'house', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000013', name: 'Subscriptions', ui: 'spotify', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000014', name: 'Healthcare', ui: 'outflow', transactionType: 'expense', type: 'image' },
  { _id: '665a10000000000000000015', name: 'Transfers', ui: 'transfer', transactionType: 'expense', type: 'image' },
];

module.exports = DEFAULT_CATEGORIES;
