import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { Product } from './productsApi'

export interface HeroBanner { id: string; imageUrl: string; title: string; subtitle: string; ctaLabel: string; ctaRoute: string; ctaParams?: Record<string, string> }
export interface StylePost { id: string; title: string; imageUrl: string; excerpt: string; url: string }
export interface HomeData {
  banners: HeroBanner[]; flashSaleEndTime: string; flashSaleProducts: Product[]
  aiPicks: Product[]; trending: Product[]; newArrivals: Product[]
  superDeals: Product[]; stylePosts: StylePost[]; brandVideoUrl?: string
}

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  endpoints: builder => ({
    getHomeData: builder.query<HomeData, void>({
      query: () => '/home',
    }),
  }),
})

export const { useGetHomeDataQuery } = homeApi
