import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@services/apiClient'
import { API_ENDPOINTS } from '@shared/constants/api'

export interface LoginRequest { email: string; password: string }
export interface RegisterRequest { fullName: string; email: string; phone: string; password: string }
export interface OtpRequest { destination: string; otp: string; purpose: string }
export interface RefreshTokenRequest { refreshToken: string }
export interface AuthResponse {
  user: { id: string; name: string; email: string; phone: string; avatar?: string; loyaltyPoints: number }
  accessToken: string
  refreshToken: string
}
export interface Session { id: string; device: string; location: string; lastSeen: string }
export interface MfaSetupResponse { qrCodeUrl: string; secret: string; backupCodes: string[] }

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: body => ({ url: API_ENDPOINTS.LOGIN, method: 'POST', body }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: body => ({ url: API_ENDPOINTS.REGISTER, method: 'POST', body }),
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: body => ({ url: API_ENDPOINTS.LOGOUT, method: 'POST', body }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: body => ({ url: API_ENDPOINTS.FORGOT_PASSWORD, method: 'POST', body }),
    }),
    verifyOtp: builder.mutation<AuthResponse, OtpRequest>({
      query: body => ({ url: API_ENDPOINTS.VERIFY_OTP, method: 'POST', body }),
    }),
    googleAuth: builder.mutation<AuthResponse, { idToken: string }>({
      query: body => ({ url: API_ENDPOINTS.GOOGLE_AUTH, method: 'POST', body }),
    }),
    appleAuth: builder.mutation<AuthResponse, { identityToken: string; authorizationCode: string }>({
      query: body => ({ url: API_ENDPOINTS.APPLE_AUTH, method: 'POST', body }),
    }),
    enableMfa: builder.mutation<MfaSetupResponse, void>({
      query: () => ({ url: API_ENDPOINTS.ENABLE_MFA, method: 'POST' }),
    }),
    verifyMfa: builder.mutation<void, { totpCode: string }>({
      query: body => ({ url: API_ENDPOINTS.VERIFY_MFA, method: 'POST', body }),
    }),
    getSessions: builder.query<Session[], void>({
      query: () => API_ENDPOINTS.SESSIONS,
    }),
    revokeSession: builder.mutation<void, string>({
      query: id => ({ url: `${API_ENDPOINTS.SESSIONS}/${id}`, method: 'DELETE' }),
    }),
  }),
})

export const {
  useLoginMutation, useRegisterMutation, useLogoutMutation, useForgotPasswordMutation,
  useVerifyOtpMutation, useGoogleAuthMutation, useAppleAuthMutation,
  useEnableMfaMutation, useVerifyMfaMutation, useGetSessionsQuery, useRevokeSessionMutation,
} = authApi
