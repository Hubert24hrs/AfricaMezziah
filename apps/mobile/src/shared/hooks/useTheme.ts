import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { darkTheme, lightTheme, Theme } from '@shared/theme'

interface RootStateForTheme {
  app: { isDarkMode: boolean }
}

export const useTheme = (): Theme => {
  const isDarkMode = useSelector((state: RootStateForTheme) => state.app.isDarkMode)
  return useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode])
}
