import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { ChatMessage, ChatResponse, AIRecommendation } from '@features/ai-assistant/ai.types'

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    sendMessage: builder.mutation<ChatResponse, { messages: ChatMessage[]; sessionId?: string }>({
      query: body => ({ url: '/ai/chat', method: 'POST', data: body }),
    }),
    getRecommendations: builder.query<AIRecommendation[], { limit?: number; context?: string }>({
      query: params => ({ url: '/ai/recommendations', method: 'GET', params }),
    }),
    getOutfitSuggestions: builder.mutation<AIRecommendation[], { productId: string }>({
      query: body => ({ url: '/ai/outfit-suggestions', method: 'POST', data: body }),
    }),
  }),
})

export const {
  useSendMessageMutation,
  useGetRecommendationsQuery,
  useGetOutfitSuggestionsMutation,
} = aiApi
