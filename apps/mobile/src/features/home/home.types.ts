import type { Product } from '@features/catalog/catalog.types'

export interface Banner {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
  ctaLabel: string
  ctaRoute: string
  ctaParams?: Record<string, string>
}

export interface FlashSaleData {
  endsAt: string
  products: Product[]
}

export interface HomeData {
  banners: Banner[]
  flashSale: FlashSaleData
  aiPicks: Product[]
  trending: Product[]
  newArrivals: Product[]
  superDeals: Product[]
  styleBlog: BlogPost[]
}

export interface BlogPost {
  id: string
  title: string
  imageUrl: string
  readTime: number
  url: string
}
