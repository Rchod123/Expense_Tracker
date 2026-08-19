/** Converts integer paise from SQLite into a display value for the UI. */
export const formatCurrency = (amountInPaise: number): string => {
  const amountInRupees = amountInPaise / 100;
  return `₹ ${amountInRupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
