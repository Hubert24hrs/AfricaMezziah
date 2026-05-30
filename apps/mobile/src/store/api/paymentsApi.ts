import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'

export interface PaymentInitResponse { authUrl?: string; reference: string }
export interface WalletTransaction { id: string; amount: number; type: 'credit' | 'debit'; description: string; date: string }
export interface Wallet { balance: number; currency: string; transactions: WalletTransaction[] }

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Payment', 'Wallet'],
  endpoints: builder => ({
    initiatePayment: builder.mutation<PaymentInitResponse, { orderId: string; method: string; currency: string }>({
      query: body => ({ url: API_ENDPOINTS.PAYMENT_INITIATE, method: 'POST', body }),
    }),
    verifyPayment: builder.mutation<{ status: string; orderId: string }, { reference: string }>({
      query: body => ({ url: API_ENDPOINTS.PAYMENT_VERIFY, method: 'POST', body }),
    }),
    getWallet: builder.query<Wallet, void>({
      query: () => API_ENDPOINTS.WALLET,
      providesTags: ['Wallet'],
    }),
  }),
})

export const { useInitiatePaymentMutation, useVerifyPaymentMutation, useGetWalletQuery } = paymentsApi
