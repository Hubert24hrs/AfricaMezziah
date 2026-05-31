import type { Product } from '@features/catalog/catalog.types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  reply: string
  products?: Product[]
  sessionId?: string
}

export interface AIRecommendation {
  id: string
  title: string
  price: number
  imageUrl: string
  rating?: number
  reason?: string
}
