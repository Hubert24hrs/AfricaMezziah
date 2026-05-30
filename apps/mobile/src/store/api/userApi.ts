import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'
import { Product } from './productsApi'

export interface UserProfile {
  id: string; name: string; email: string; phone: string; avatar?: string
  birthday?: string; loyaltyPoints: number; tier: string; referralCode: string
}
export interface Address {
  id: string; label: string; line1: string; line2?: string; city: string
  state: string; country: string; postalCode: string; isDefault: boolean
}
export interface PaymentMethod { id: string; type: string; last4: string; expiry: string; isDefault: boolean; brand: string }
export interface LoyaltyInfo { points: number; tier: string; history: Array<{ points: number; reason: string; date: string }> }

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Address', 'Wishlist', 'PaymentMethod'],
  endpoints: builder => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => API_ENDPOINTS.ME,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: body => ({ url: API_ENDPOINTS.ME, method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    uploadAvatar: builder.mutation<UserProfile, FormData>({
      query: body => ({ url: `${API_ENDPOINTS.ME}/avatar`, method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    getAddresses: builder.query<Address[], void>({
      query: () => API_ENDPOINTS.ADDRESSES,
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation<Address, Omit<Address, 'id'>>({
      query: body => ({ url: API_ENDPOINTS.ADDRESSES, method: 'POST', body }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation<Address, Address>({
      query: ({ id, ...body }) => ({ url: `${API_ENDPOINTS.ADDRESSES}/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation<void, string>({
      query: id => ({ url: `${API_ENDPOINTS.ADDRESSES}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
    getWishlist: builder.query<{ data: Product[] }, { page?: number }>({
      query: params => ({ url: API_ENDPOINTS.WISHLIST, params }),
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation<void, string>({
      query: productId => ({ url: API_ENDPOINTS.WISHLIST, method: 'POST', body: { productId } }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation<void, string>({
      query: productId => ({ url: `${API_ENDPOINTS.WISHLIST}/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
    getLoyalty: builder.query<LoyaltyInfo, void>({
      query: () => API_ENDPOINTS.LOYALTY,
    }),
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => API_ENDPOINTS.PAYMENT_METHODS,
      providesTags: ['PaymentMethod'],
    }),
    addPaymentMethod: builder.mutation<PaymentMethod, { token: string; type: string }>({
      query: body => ({ url: API_ENDPOINTS.PAYMENT_METHODS, method: 'POST', body }),
      invalidatesTags: ['PaymentMethod'],
    }),
    deletePaymentMethod: builder.mutation<void, string>({
      query: id => ({ url: `${API_ENDPOINTS.PAYMENT_METHODS}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PaymentMethod'],
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: API_ENDPOINTS.ME, method: 'DELETE' }),
    }),
  }),
})

export const {
  useGetProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation,
  useGetAddressesQuery, useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation,
  useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation,
  useGetLoyaltyQuery, useGetPaymentMethodsQuery, useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation, useDeleteAccountMutation,
} = userApi
