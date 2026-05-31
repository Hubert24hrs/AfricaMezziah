import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { PaymentMethod, PaymentInitResponse, PaymentVerifyResponse, Wallet } from '@features/cart/cart.types'

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['PaymentMethod', 'Wallet'],
  endpoints: builder => ({
    initiatePayment: builder.mutation<PaymentInitResponse, { orderId: string; method: string; currency: string }>({
      query: body => ({ url: '/payments/initiate', method: 'POST', data: body }),
    }),
    verifyPayment: builder.mutation<PaymentVerifyResponse, { reference: string }>({
      query: body => ({ url: '/payments/verify', method: 'POST', data: body }),
    }),
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => ({ url: '/payments/methods', method: 'GET' }),
      providesTags: ['PaymentMethod'],
    }),
    addPaymentMethod: builder.mutation<PaymentMethod, { token: string; type: string }>({
      query: body => ({ url: '/payments/methods', method: 'POST', data: body }),
      invalidatesTags: ['PaymentMethod'],
    }),
    deletePaymentMethod: builder.mutation<void, string>({
      query: id => ({ url: `/payments/methods/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PaymentMethod'],
    }),
    getWallet: builder.query<Wallet, void>({
      query: () => ({ url: '/payments/wallet', method: 'GET' }),
      providesTags: ['Wallet'],
    }),
  }),
})

export const {
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useGetWalletQuery,
} = paymentsApi
