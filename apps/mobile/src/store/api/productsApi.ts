import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'

export interface Product {
  id: string; name: string; description: string; price: number; originalPrice?: number
  currency: string; images: string[]; category: string; subcategory: string
  brand: string; rating: number; reviewCount: number; inStock: boolean
  sizes: string[]; colors: ProductColor[]; material: string; occasion: string
  tags: string[]; seller: Seller; variants: ProductVariant[]; has3dModel: boolean
}
export interface ProductColor { name: string; hex: string }
export interface ProductVariant { id: string; size: string; color: string; stock: number; price: number }
export interface Seller { id: string; name: string; rating: number; location: string }
export interface Category { id: string; name: string; image: string; subcategories?: Category[] }
export interface Review {
  id: string; rating: number; title: string; body: string; photos: string[]
  user: { name: string; avatar?: string }; createdAt: string; verified: boolean; helpfulCount: number
}
export interface ProductListParams {
  page?: number; limit?: number; category?: string; subcategory?: string
  minPrice?: number; maxPrice?: number; sizes?: string; colors?: string
  brands?: string; rating?: number; sort?: string; q?: string
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Review'],
  keepUnusedDataFor: 86400,
  endpoints: builder => ({
    getProducts: builder.query<{ data: Product[]; meta: { total: number; page: number; totalPages: number } }, ProductListParams>({
      query: params => ({ url: API_ENDPOINTS.PRODUCTS, params }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: id => `${API_ENDPOINTS.PRODUCTS}/${id}`,
      providesTags: (_, __, id) => [{ type: 'Product', id }],
    }),
    getProductReviews: builder.query<{ data: Review[]; meta: { total: number } }, { id: string; page?: number; rating?: number }>({
      query: ({ id, ...params }) => ({ url: `${API_ENDPOINTS.PRODUCTS}/${id}/reviews`, params }),
      providesTags: (_, __, { id }) => [{ type: 'Review', id }],
    }),
    addReview: builder.mutation<Review, { id: string; rating: number; title: string; body: string; photos?: string[] }>({
      query: ({ id, ...body }) => ({ url: `${API_ENDPOINTS.PRODUCTS}/${id}/reviews`, method: 'POST', body }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Review', id }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => API_ENDPOINTS.CATEGORIES,
    }),
    getCategoryProducts: builder.query<{ data: Product[]; meta: { total: number } }, { categoryId: string } & ProductListParams>({
      query: ({ categoryId, ...params }) => ({ url: `${API_ENDPOINTS.CATEGORIES}/${categoryId}/products`, params }),
    }),
    visualSearch: builder.mutation<Product[], { imageBase64: string }>({
      query: body => ({ url: API_ENDPOINTS.VISUAL_SEARCH, method: 'POST', body }),
    }),
  }),
})

export const {
  useGetProductsQuery, useGetProductQuery, useGetProductReviewsQuery, useAddReviewMutation,
  useGetCategoriesQuery, useGetCategoryProductsQuery, useVisualSearchMutation,
} = productsApi
