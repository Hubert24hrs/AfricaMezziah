import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'
import { Product } from './productsApi'

export interface CartItem {
  id: string; product: Product; variantId: string; quantity: number
  size: string; color: string; price: number
}
export interface Cart {
  items: CartItem[]; subtotal: number; shipping: number; discount: number
  total: number; couponCode?: string; itemCount: number
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Cart'],
  endpoints: builder => ({
    getCart: builder.query<Cart, void>({
      query: () => API_ENDPOINTS.CART,
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, { productId: string; variantId: string; quantity: number }>({
      query: body => ({ url: API_ENDPOINTS.CART_ITEMS, method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({ url: `${API_ENDPOINTS.CART_ITEMS}/${id}`, method: 'PUT', body: { quantity } }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<Cart, string>({
      query: id => ({ url: `${API_ENDPOINTS.CART_ITEMS}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation<Cart, { code: string }>({
      query: body => ({ url: API_ENDPOINTS.APPLY_COUPON, method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation<Cart, void>({
      query: () => ({ url: API_ENDPOINTS.REMOVE_COUPON, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    getShippingEstimate: builder.query<{ amount: number; estimatedDays: number }, string>({
      query: addressId => ({ url: API_ENDPOINTS.SHIPPING_ESTIMATE, params: { addressId } }),
    }),
  }),
})

export const {
  useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation,
  useRemoveCartItemMutation, useApplyCouponMutation, useRemoveCouponMutation,
  useGetShippingEstimateQuery,
} = cartApi
