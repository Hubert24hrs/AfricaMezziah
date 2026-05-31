import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { UserProfile, Address, WishlistItem, LoyaltyInfo, ReferralInfo, ApiListResponse } from '@features/profile/profile.types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User', 'Address', 'Wishlist'],
  endpoints: builder => ({
    getMe: builder.query<UserProfile, void>({
      query: () => ({ url: '/users/me', method: 'GET' }),
      providesTags: ['User'],
    }),
    updateMe: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: body => ({ url: '/users/me', method: 'PUT', data: body }),
      invalidatesTags: ['User'],
    }),
    uploadAvatar: builder.mutation<UserProfile, FormData>({
      query: body => ({ url: '/users/me/avatar', method: 'POST', data: body }),
      invalidatesTags: ['User'],
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: '/users/me', method: 'DELETE' }),
    }),
    getAddresses: builder.query<Address[], void>({
      query: () => ({ url: '/users/me/addresses', method: 'GET' }),
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation<Address, Omit<Address, 'id'>>({
      query: body => ({ url: '/users/me/addresses', method: 'POST', data: body }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation<Address, Address>({
      query: ({ id, ...body }) => ({ url: `/users/me/addresses/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation<void, string>({
      query: id => ({ url: `/users/me/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
    getWishlist: builder.query<ApiListResponse<WishlistItem>, { page?: number; limit?: number }>({
      query: params => ({ url: '/users/me/wishlist', method: 'GET', params }),
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation<void, string>({
      query: productId => ({ url: '/users/me/wishlist', method: 'POST', data: { productId } }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation<void, string>({
      query: productId => ({ url: `/users/me/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
    getLoyalty: builder.query<LoyaltyInfo, void>({
      query: () => ({ url: '/users/me/loyalty', method: 'GET' }),
    }),
    getReferral: builder.query<ReferralInfo, void>({
      query: () => ({ url: '/users/me/referral', method: 'GET' }),
    }),
  }),
})

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
  useDeleteAccountMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetLoyaltyQuery,
  useGetReferralQuery,
} = userApi
