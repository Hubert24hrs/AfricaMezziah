export interface ProductVariant {
  id: string
  size?: string
  color?: string
  colorHex?: string
  stock: number
  price: number
}

export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  imageUrl: string
  images?: string[]
  rating?: number
  reviewCount?: number
  category: string
  subcategory?: string
  brand?: string
  isNew?: boolean
  isHot?: boolean
  isFlashSale?: boolean
  isOutOfStock?: boolean
  currency?: string
  likeCount?: number
  variants?: ProductVariant[]
}

export interface ProductDetail extends Product {
  description: string
  material?: string
  careInstructions?: string
  seller?: { id: string; name: string; rating: number }
  threeDModelUrl?: string
  video3dUrl?: string
  tags?: string[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  body: string
  photos?: string[]
  createdAt: string
  helpfulCount: number
}

export interface Category {
  id: string
  name: string
  imageUrl: string
  parentId?: string
  children?: Category[]
  productCount: number
}

export interface ProductsQuery {
  page?: number
  limit?: number
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  brands?: string[]
  rating?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating' | 'discount'
  q?: string
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
