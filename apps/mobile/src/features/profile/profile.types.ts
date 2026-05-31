export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  birthday?: string
  loyaltyPoints: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  isMFAEnabled: boolean
  createdAt: string
}

export interface Address {
  id: string
  label: string
  line1: string
  line2?: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault: boolean
}

export interface WishlistItem {
  id: string
  productId: string
  title: string
  price: number
  originalPrice?: number
  imageUrl: string
  rating?: number
  currency?: string
}

export interface LoyaltyInfo {
  points: number
  tier: string
  history: Array<{ description: string; points: number; createdAt: string }>
}

export interface ReferralInfo {
  code: string
  totalReferrals: number
  earnings: number
}

export interface ApiListResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

