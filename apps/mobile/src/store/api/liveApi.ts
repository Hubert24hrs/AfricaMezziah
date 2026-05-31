import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { LiveStream, LiveStreamDetail } from '@features/live/live.types'

export const liveApi = createApi({
  reducerPath: 'liveApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['LiveStream'],
  endpoints: builder => ({
    getStreams: builder.query<LiveStream[], { status?: 'live' | 'upcoming'; category?: string }>({
      query: params => ({ url: '/live/streams', method: 'GET', params }),
      providesTags: ['LiveStream'],
    }),
    getStreamById: builder.query<LiveStreamDetail, string>({
      query: id => ({ url: `/live/streams/${id}`, method: 'GET' }),
    }),
    sendChatMessage: builder.mutation<void, { streamId: string; message: string }>({
      query: ({ streamId, message }) => ({
        url: `/live/streams/${streamId}/chat`,
        method: 'POST',
        data: { message },
      }),
    }),
  }),
})

export const {
  useGetStreamsQuery,
  useGetStreamByIdQuery,
  useSendChatMessageMutation,
} = liveApi
