import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from './auth.types'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricEnabled: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.isLoading = false
    },
    setBiometricEnabled(state, action: PayloadAction<boolean>) {
      state.biometricEnabled = action.payload
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { setCredentials, logout, setLoading, setError, setBiometricEnabled, updateUser } =
  authSlice.actions

export default authSlice.reducer
