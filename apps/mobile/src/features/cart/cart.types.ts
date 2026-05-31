export interface CartItem {
  id: string
  productId: string
  variantId: string
  title: string
  imageUrl: string
  size?: string
  color?: string
  price: number
  quantity: number
  currency?: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  couponCode?: string
  currency: string
  itemCount: number
}

export interface ShippingEstimate {
  standard: { price: number; days: string }
  express: { price: number; days: string }
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'paystack' | 'flutterwave' | 'bank' | 'wallet' | 'cod'
  last4?: string
  expiry?: string
  bank?: string
  isDefault: boolean
}

export interface PaymentInitResponse {
  authUrl?: string
  reference: string
}

export interface PaymentVerifyResponse {
  status: 'success' | 'failed' | 'pending'
  orderId: string
}

export interface Wallet {
  balance: number
  currency: string
  transactions: WalletTransaction[]
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  createdAt: string
}
