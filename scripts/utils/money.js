/**
 * formatter for currency (USD) with thousand separators
 * @param {number} cents - Should be in cents
 * @returns {string} String in the format of "$#.00"
 */
export function formatCurrency(cents) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return currencyFormatter.format(cents / 100);
}
