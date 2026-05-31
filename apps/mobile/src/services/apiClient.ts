import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import * as Sentry from '@sentry/react-native'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './keychainService'
import { signRequest } from '@shared/utils/hmac'

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? ''
const TIMEOUT = Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 30000)

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': process.env.EXPO_PUBLIC_APP_VERSION ?? '1.0.0',
    'X-Platform': 'mobile',
  },
})

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const { signature, timestamp } = signRequest(
    config.method?.toUpperCase() ?? 'GET',
    config.url ?? '',
    config.data ? JSON.stringify(config.data) : '',
  )
  config.headers['X-Request-Signature'] = signature
  config.headers['X-Request-Timestamp'] = timestamp

  return config
})

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

const processQueue = (token: string) => {
  refreshQueue.forEach(cb => cb(token))
  refreshQueue = []
}

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          refreshQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = await getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken },
        )
        const { accessToken, refreshToken: newRefresh } = data.data
        await saveTokens(accessToken, newRefresh)
        processQueue(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch {
        await clearTokens()
        // Dispatch logout action via event emitter to avoid circular dep
        refreshQueue = []
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    Sentry.withScope(scope => {
      scope.setTag('api_error', 'true')
      scope.setExtra('url', originalRequest?.url)
      scope.setExtra('method', originalRequest?.method)
      scope.setExtra('status', error.response?.status)
      Sentry.captureException(error)
    })

    return Promise.reject(error)
  },
)

export const axiosBaseQuery =
  (): BaseQueryFn<{
    url: string
    method: AxiosRequestConfig['method']
    data?: unknown
    params?: unknown
  }> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await apiClient({ url, method, data, params })
      return { data: (result.data as { data: unknown }).data ?? result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError<{ error?: { code: string; message: string } }>
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data?.error ?? err.message,
        },
      }
    }
  }
