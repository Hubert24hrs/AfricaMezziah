import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import * as Sentry from '@sentry/react-native'
import { CONFIG } from '@shared/constants/config'
import { getAccessToken, getRefreshToken, storeTokens, clearTokens } from './keychainService'
import { generateHmacSignature, generateRequestTimestamp } from '@shared/utils/securityUtils'
import { logout } from '@features/auth/authSlice'

const SENSITIVE_FIELDS = ['password', 'token', 'cardNumber', 'cvv', 'otp']

const sanitizeForLogging = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') return data
  const sanitized: Record<string, unknown> = { ...data as Record<string, unknown> }
  SENSITIVE_FIELDS.forEach(field => {
    if (field in sanitized) sanitized[field] = '[REDACTED]'
  })
  return sanitized
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: CONFIG.API_BASE_URL,
  prepareHeaders: async (headers, { getState: _gs }) => {
    const token = await getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
    headers.set('X-App-Version', '1.0.0')
    headers.set('X-Platform', 'react-native')
    return headers
  },
})

const addSignatureHeaders = async (
  args: FetchArgs,
  headers: Record<string, string>,
): Promise<Record<string, string>> => {
  const method = args.method ?? 'GET'
  const url = typeof args.url === 'string' ? args.url : String(args.url)
  const body = args.body ? JSON.stringify(args.body) : ''
  const timestamp = generateRequestTimestamp()
  const sig = generateHmacSignature(method, url, timestamp, body)
  return {
    ...headers,
    'X-Request-Signature': sig,
    'X-Request-Timestamp': String(timestamp),
  }
}

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const fetchArgs: FetchArgs = typeof args === 'string' ? { url: args } : args
  const signedHeaders = await addSignatureHeaders(fetchArgs, {})

  const result = await rawBaseQuery(
    { ...fetchArgs, headers: { ...fetchArgs.headers, ...signedHeaders } },
    api,
    extraOptions,
  )

  if (result.error?.status === 401) {
    const refreshToken = await getRefreshToken()
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: '/auth/refresh-token', method: 'POST', body: { refreshToken } },
        api,
        extraOptions,
      )
      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefresh } = refreshResult.data as { accessToken: string; refreshToken: string }
        await storeTokens(accessToken, newRefresh)
        return rawBaseQuery(
          { ...fetchArgs, headers: { ...fetchArgs.headers, ...signedHeaders, Authorization: `Bearer ${accessToken}` } },
          api,
          extraOptions,
        )
      }
    }
    await clearTokens()
    api.dispatch(logout())
  }

  if (result.error) {
    Sentry.captureException(new Error(`API Error ${result.error.status}`), {
      extra: {
        url: typeof args === 'string' ? args : args.url,
        status: result.error.status,
        data: sanitizeForLogging(result.error.data),
      },
    })
  }

  return result
}

export const analyticsService = {
  logEvent: (_name: string, _params?: Record<string, unknown>) => {
    // implemented in analyticsService.ts
  },
}
