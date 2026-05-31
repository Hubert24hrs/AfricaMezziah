import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { Product, ProductDetail, Review, Category, ProductsQuery, ApiListResponse } from '@features/catalog/catalog.types'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Product', 'Review', 'Category'],
  endpoints: builder => ({
    getProducts: builder.query<ApiListResponse<Product>, ProductsQuery>({
      query: params => ({ url: '/products', method: 'GET', params }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ProductDetail, string>({
      query: id => ({ url: `/products/${id}`, method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getProductReviews: builder.query<ApiListResponse<Review>, { id: string; page?: number; rating?: number }>({
      query: ({ id, ...params }) => ({ url: `/products/${id}/reviews`, method: 'GET', params }),
      providesTags: (_r, _e, { id }) => [{ type: 'Review', id }],
    }),
    postReview: builder.mutation<Review, { id: string; rating: number; title: string; body: string }>({
      query: ({ id, ...body }) => ({ url: `/products/${id}/reviews`, method: 'POST', data: body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Review', id }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/categories', method: 'GET' }),
      providesTags: ['Category'],
    }),
    getCategoryProducts: builder.query<ApiListResponse<Product>, { categoryId: string } & ProductsQuery>({
      query: ({ categoryId, ...params }) => ({
        url: `/categories/${categoryId}/products`,
        method: 'GET',
        params,
      }),
    }),
    visualSearch: builder.mutation<Product[], { imageBase64: string }>({
      query: body => ({ url: '/search/visual', method: 'POST', data: body }),
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductReviewsQuery,
  usePostReviewMutation,
  useGetCategoriesQuery,
  useGetCategoryProductsQuery,
  useVisualSearchMutation,
} = productsApi
