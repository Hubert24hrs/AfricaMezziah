const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
  KES: 'KSh',
  GHS: '₵',
}

export const formatCurrency = (amount: number, currency = 'NGN'): string => {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatDiscount = (original: number, sale: number): number =>
  Math.round(((original - sale) / original) * 100)
