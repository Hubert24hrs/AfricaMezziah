export const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
  KES: 'KSh',
  GHS: 'GH₵',
}

export const formatCurrency = (
  amount: number,
  currency = 'NGN',
  showSymbol = true,
): string => {
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  if (!showSymbol) return formatted
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency
  return `${symbol}${formatted}`
}

export const formatDiscount = (original: number, sale: number): string => {
  const pct = Math.round(((original - sale) / original) * 100)
  return `-${pct}%`
}
