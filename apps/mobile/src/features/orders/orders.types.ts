export interface OrderItem {
  id: string
  productId: string
  title: string
  imageUrl: string
  size?: string
  color?: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'outForDelivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded'
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  currency: string
  address: { line1: string; city: string; country: string }
  paymentMethod: string
  createdAt: string
  estimatedDelivery?: string
}

export interface TrackingStep {
  label: string
  timestamp?: string
  completed: boolean
}

export interface OrderTracking {
  steps: TrackingStep[]
  currentLocation?: { lat: number; lng: number }
  estimatedDelivery: string
}

export interface ReturnRequest {
  items: Array<{ itemId: string; quantity: number }>
  reason: string
  description: string
  photos?: string[]
}

export interface ApiListResponse<T> {
  data: T[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}
