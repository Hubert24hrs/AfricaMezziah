import { createSlice } from '@reduxjs/toolkit'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'theme-storage' })

interface ThemeState {
  isDark: boolean
}

const initialState: ThemeState = {
  isDark: storage.getBoolean('is_dark') ?? true,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDark = !state.isDark
      storage.set('is_dark', state.isDark)
    },
    setDark(state) {
      state.isDark = true
      storage.set('is_dark', true)
    },
    setLight(state) {
      state.isDark = false
      storage.set('is_dark', false)
    },
  },
})

export const { toggleTheme, setDark, setLight } = themeSlice.actions
export default themeSlice.reducer
