import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'
import { Product } from './productsApi'

export interface ChatMessage { role: 'user' | 'assistant'; content: string }
export interface ChatResponse { reply: string; products?: Product[] }
export interface OutfitSuggestion { id: string; name: string; items: Product[]; occasion: string }

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    chat: builder.mutation<ChatResponse, { messages: ChatMessage[]; sessionId?: string }>({
      query: body => ({ url: API_ENDPOINTS.AI_CHAT, method: 'POST', body }),
    }),
    getRecommendations: builder.query<Product[], { limit?: number; context?: string }>({
      query: params => ({ url: API_ENDPOINTS.AI_RECOMMENDATIONS, params }),
    }),
    getOutfitSuggestions: builder.mutation<OutfitSuggestion[], { productId: string }>({
      query: body => ({ url: API_ENDPOINTS.AI_OUTFIT_SUGGESTIONS, method: 'POST', body }),
    }),
  }),
})

export const { useChatMutation, useGetRecommendationsQuery, useGetOutfitSuggestionsMutation } = aiApi
