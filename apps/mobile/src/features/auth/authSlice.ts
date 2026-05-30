import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MMKV } from 'react-native-mmkv'
import { authApi } from '@store/api/authApi'

const storage = new MMKV({ id: 'auth-storage' })

interface User {
  id: string; name: string; email: string; phone: string; avatar?: string; loyaltyPoints: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  onboardingComplete: boolean
  consentGiven: boolean
  biometricEnabled: boolean
  mfaEnabled: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  onboardingComplete: storage.getBoolean('onboarding_complete') ?? false,
  consentGiven: storage.getBoolean('consent_given') ?? false,
  biometricEnabled: storage.getBoolean('biometric_enabled') ?? false,
  mfaEnabled: storage.getBoolean('mfa_enabled') ?? false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    },
    completeOnboarding(state) {
      state.onboardingComplete = true
      storage.set('onboarding_complete', true)
    },
    giveConsent(state) {
      state.consentGiven = true
      storage.set('consent_given', true)
    },
    setBiometricEnabled(state, action: PayloadAction<boolean>) {
      state.biometricEnabled = action.payload
      storage.set('biometric_enabled', action.payload)
    },
    setMfaEnabled(state, action: PayloadAction<boolean>) {
      state.mfaEnabled = action.payload
      storage.set('mfa_enabled', action.payload)
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.isAuthenticated = true
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.isAuthenticated = true
      })
      .addMatcher(authApi.endpoints.googleAuth.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.isAuthenticated = true
      })
      .addMatcher(authApi.endpoints.appleAuth.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.isAuthenticated = true
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, state => {
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { setUser, logout, completeOnboarding, giveConsent, setBiometricEnabled, setMfaEnabled } = authSlice.actions
export default authSlice.reducer
