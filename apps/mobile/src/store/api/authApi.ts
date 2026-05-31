import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@services/apiClient'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  OTPVerifyRequest,
  ForgotPasswordRequest,
  SocialAuthRequest,
  MFASetupResponse,
  MFAVerifyRequest,
  ActiveSession,
} from '@features/auth/auth.types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Session'],
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({ url: '/auth/login', method: 'POST', data: body }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: body => ({ url: '/auth/register', method: 'POST', data: body }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, { refreshToken: string }>({
      query: body => ({ url: '/auth/refresh-token', method: 'POST', data: body }),
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: body => ({ url: '/auth/logout', method: 'POST', data: body }),
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: body => ({ url: '/auth/forgot-password', method: 'POST', data: body }),
    }),
    verifyOTP: builder.mutation<LoginResponse, OTPVerifyRequest>({
      query: body => ({ url: '/auth/verify-otp', method: 'POST', data: body }),
    }),
    googleAuth: builder.mutation<LoginResponse, SocialAuthRequest>({
      query: body => ({ url: '/auth/google', method: 'POST', data: body }),
    }),
    appleAuth: builder.mutation<LoginResponse, { identityToken: string; authorizationCode: string }>({
      query: body => ({ url: '/auth/apple', method: 'POST', data: body }),
    }),
    enableMFA: builder.mutation<MFASetupResponse, void>({
      query: () => ({ url: '/auth/enable-mfa', method: 'POST' }),
    }),
    verifyMFA: builder.mutation<void, MFAVerifyRequest>({
      query: body => ({ url: '/auth/verify-mfa', method: 'POST', data: body }),
    }),
    getSessions: builder.query<ActiveSession[], void>({
      query: () => ({ url: '/auth/sessions', method: 'GET' }),
      providesTags: ['Session'],
    }),
    revokeSession: builder.mutation<void, string>({
      query: id => ({ url: `/auth/sessions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Session'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useGoogleAuthMutation,
  useAppleAuthMutation,
  useEnableMFAMutation,
  useVerifyMFAMutation,
  useGetSessionsQuery,
  useRevokeSessionMutation,
} = authApi
