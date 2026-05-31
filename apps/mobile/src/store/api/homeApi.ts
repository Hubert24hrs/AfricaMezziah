import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type { Banner, FlashSaleData, HomeData } from '@features/home/home.types'

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Home'],
  endpoints: builder => ({
    getHomeData: builder.query<HomeData, void>({
      query: () => ({ url: '/home', method: 'GET' }),
      providesTags: ['Home'],
    }),
    getBanners: builder.query<Banner[], void>({
      query: () => ({ url: '/home/banners', method: 'GET' }),
    }),
    getFlashSale: builder.query<FlashSaleData, void>({
      query: () => ({ url: '/home/flash-sale', method: 'GET' }),
    }),
  }),
})

export const {
  useGetHomeDataQuery,
  useGetBannersQuery,
  useGetFlashSaleQuery,
} = homeApi
