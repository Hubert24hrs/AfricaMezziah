import type { Product } from '@features/catalog/catalog.types'

export interface LiveStream {
  id: string
  title: string
  hostName: string
  hostAvatar?: string
  thumbnailUrl: string
  status: 'live' | 'upcoming'
  viewerCount: number
  scheduledAt?: string
  category?: string
}

export interface LiveStreamDetail extends LiveStream {
  streamUrl: string
  products: Product[]
  chatMessages: LiveChatMessage[]
}

export interface LiveChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
}
