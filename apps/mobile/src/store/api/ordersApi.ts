import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { Order, OrderTracking, ReturnRequest, ApiListResponse } from '@features/orders/orders.types'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Order'],
  endpoints: builder => ({
    createOrder: builder.mutation<Order, { addressId: string; paymentMethodId: string; couponCode?: string }>({
      query: body => ({ url: '/orders', method: 'POST', data: body }),
      invalidatesTags: ['Order'],
    }),
    getOrders: builder.query<ApiListResponse<Order>, { page?: number; limit?: number; status?: string }>({
      query: params => ({ url: '/orders', method: 'GET', params }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<Order, string>({
      query: id => ({ url: `/orders/${id}`, method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    getOrderTracking: builder.query<OrderTracking, string>({
      query: id => ({ url: `/orders/${id}/tracking`, method: 'GET' }),
    }),
    createReturnRequest: builder.mutation<void, { orderId: string } & ReturnRequest>({
      query: ({ orderId, ...body }) => ({ url: `/orders/${orderId}/return`, method: 'POST', data: body }),
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderTrackingQuery,
  useCreateReturnRequestMutation,
} = ordersApi
