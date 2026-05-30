import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'
import { Product } from './productsApi'

export interface LiveStream {
  id: string; title: string; hostName: string; hostAvatar: string; thumbnail: string
  streamUrl: string; viewerCount: number; status: 'live' | 'upcoming'; category: string
  products: Product[]; scheduledAt?: string; startedAt?: string
}
export interface ChatMsg { id: string; user: string; avatar?: string; message: string; timestamp: string }

export const liveApi = createApi({
  reducerPath: 'liveApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Stream'],
  endpoints: builder => ({
    getStreams: builder.query<LiveStream[], { status?: 'live' | 'upcoming'; category?: string }>({
      query: params => ({ url: API_ENDPOINTS.LIVE_STREAMS, params }),
      providesTags: ['Stream'],
    }),
    getStream: builder.query<LiveStream, string>({
      query: id => `${API_ENDPOINTS.LIVE_STREAMS}/${id}`,
      providesTags: (_, __, id) => [{ type: 'Stream', id }],
    }),
    sendChat: builder.mutation<void, { streamId: string; message: string }>({
      query: ({ streamId, message }) => ({
        url: `${API_ENDPOINTS.LIVE_STREAMS}/${streamId}/chat`, method: 'POST', body: { message },
      }),
    }),
  }),
})

export const { useGetStreamsQuery, useGetStreamQuery, useSendChatMutation } = liveApi
