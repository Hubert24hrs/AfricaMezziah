import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { Cart, CartItem, ShippingEstimate } from '@features/cart/cart.types'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Cart'],
  endpoints: builder => ({
    getCart: builder.query<Cart, void>({
      query: () => ({ url: '/cart', method: 'GET' }),
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, { productId: string; variantId: string; quantity: number }>({
      query: body => ({ url: '/cart/items', method: 'POST', data: body }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({ url: `/cart/items/${id}`, method: 'PUT', data: { quantity } }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<Cart, string>({
      query: id => ({ url: `/cart/items/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation<Cart, { code: string }>({
      query: body => ({ url: '/cart/apply-coupon', method: 'POST', data: body }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation<Cart, void>({
      query: () => ({ url: '/cart/remove-coupon', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    getShippingEstimate: builder.query<ShippingEstimate, string>({
      query: addressId => ({ url: '/cart/shipping-estimate', method: 'GET', params: { addressId } }),
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useGetShippingEstimateQuery,
} = cartApi
