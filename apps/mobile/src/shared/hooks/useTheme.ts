import { useSelector } from 'react-redux'
import { RootState } from '@store/store'
import { darkColors, lightColors, typography, spacing, radius, shadows, glassStyle } from '@shared/theme'

export const useTheme = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const colors = isDark ? darkColors : lightColors

  return {
    colors,
    typography,
    spacing,
    radius,
    shadows,
    glassStyle,
    isDark,
  }
}
