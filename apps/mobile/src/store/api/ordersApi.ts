import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'

export interface OrderItem { productId: string; name: string; image: string; size: string; color: string; quantity: number; price: number }
export interface TrackingStep { status: string; timestamp: string; location: string; completed: boolean }
export interface Order {
  id: string; items: OrderItem[]; status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  total: number; currency: string; createdAt: string; estimatedDelivery: string
  address: { line1: string; city: string; state: string; country: string }
  paymentMethod: string; trackingNumber?: string
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order'],
  endpoints: builder => ({
    getOrders: builder.query<{ data: Order[]; meta: { total: number } }, { page?: number; status?: string }>({
      query: params => ({ url: API_ENDPOINTS.ORDERS, params }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query<Order, string>({
      query: id => `${API_ENDPOINTS.ORDERS}/${id}`,
      providesTags: (_, __, id) => [{ type: 'Order', id }],
    }),
    getTracking: builder.query<{ steps: TrackingStep[]; currentLocation?: string; estimatedDelivery: string }, string>({
      query: id => `${API_ENDPOINTS.ORDERS}/${id}/tracking`,
    }),
    createOrder: builder.mutation<Order, { addressId: string; paymentMethodId: string; couponCode?: string }>({
      query: body => ({ url: API_ENDPOINTS.ORDERS, method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    requestReturn: builder.mutation<void, { orderId: string; items: string[]; reason: string; description: string; photos?: string[] }>({
      query: ({ orderId, ...body }) => ({ url: `${API_ENDPOINTS.ORDERS}/${orderId}/return`, method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useGetOrdersQuery, useGetOrderQuery, useGetTrackingQuery,
  useCreateOrderMutation, useRequestReturnMutation,
} = ordersApi
