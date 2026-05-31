import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  isDarkMode: boolean
  language: string
  hasSeenOnboarding: boolean
  hasGivenConsent: boolean
  isSecurityBlocked: boolean
}

const initialState: AppState = {
  isDarkMode: true,
  language: 'en',
  hasSeenOnboarding: false,
  hasGivenConsent: false,
  isSecurityBlocked: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.isDarkMode = action.payload
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
    setHasSeenOnboarding(state, action: PayloadAction<boolean>) {
      state.hasSeenOnboarding = action.payload
    },
    setHasGivenConsent(state, action: PayloadAction<boolean>) {
      state.hasGivenConsent = action.payload
    },
    setSecurityBlocked(state, action: PayloadAction<boolean>) {
      state.isSecurityBlocked = action.payload
    },
  },
})

export const {
  setDarkMode,
  setLanguage,
  setHasSeenOnboarding,
  setHasGivenConsent,
  setSecurityBlocked,
} = appSlice.actions

export default appSlice.reducer
