import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { Notification, ApiListResponse } from '@features/notifications/notifications.types'

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Notification'],
  endpoints: builder => ({
    getNotifications: builder.query<ApiListResponse<Notification>, { page?: number; limit?: number; read?: boolean }>({
      query: params => ({ url: '/notifications', method: 'GET', params }),
      providesTags: ['Notification'],
    }),
    markAllRead: builder.mutation<void, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: id => ({ url: `/notifications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
    registerDeviceToken: builder.mutation<void, { token: string; platform: 'ios' | 'android' }>({
      query: body => ({ url: '/notifications/device-token', method: 'POST', data: body }),
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
  useRegisterDeviceTokenMutation,
} = notificationsApi
