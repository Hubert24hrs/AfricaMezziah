export interface Notification {
  id: string
  type: 'order' | 'promo' | 'flash' | 'system'
  title: string
  body: string
  data?: Record<string, string>
  isRead: boolean
  createdAt: string
}

export interface ApiListResponse<T> {
  data: T[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}
