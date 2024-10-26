/**
 * formatter for currency (USD) with thousand separators
 */
export function formatCurrency(cents: number): string {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return currencyFormatter.format(cents / 100);
}
