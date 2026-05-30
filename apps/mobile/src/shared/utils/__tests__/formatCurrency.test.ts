import { formatCurrency, formatDiscount, CURRENCY_SYMBOLS } from '../formatCurrency'

describe('formatCurrency', () => {
  it('formats NGN with the naira symbol by default', () => {
    expect(formatCurrency(15000)).toBe('₦15,000')
  })

  it('uses the correct symbol for known currencies', () => {
    expect(formatCurrency(50, 'USD')).toBe('$50')
    expect(formatCurrency(50, 'GBP')).toBe('£50')
    expect(formatCurrency(50, 'EUR')).toBe('€50')
  })

  it('falls back to the currency code for unknown currencies', () => {
    expect(formatCurrency(100, 'XAF')).toBe('XAF100')
  })

  it('omits the symbol when showSymbol is false', () => {
    expect(formatCurrency(15000, 'NGN', false)).toBe('15,000')
  })

  it('rounds to whole numbers', () => {
    expect(formatCurrency(1999.99)).toBe('₦2,000')
  })

  it('exposes symbols for all supported markets', () => {
    expect(Object.keys(CURRENCY_SYMBOLS)).toEqual(
      expect.arrayContaining(['NGN', 'USD', 'GBP', 'EUR', 'KES', 'GHS']),
    )
  })
})

describe('formatDiscount', () => {
  it('computes a rounded percentage discount', () => {
    expect(formatDiscount(100, 70)).toBe('-30%')
    expect(formatDiscount(200, 150)).toBe('-25%')
  })

  it('rounds to the nearest percent', () => {
    expect(formatDiscount(99, 70)).toBe('-29%')
  })
})
