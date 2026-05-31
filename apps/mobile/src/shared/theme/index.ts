import { colors } from './colors'
import { typography, fontFamilies } from './typography'
import { spacing, radius } from './spacing'
import { shadows } from './shadows'

export const darkTheme = {
  colors: {
    ...colors,
    background: colors.background,
    surface: colors.surface,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
  },
  typography,
  fontFamilies,
  spacing,
  radius,
  shadows,
  isDark: true,
}

export const lightTheme = {
  colors: {
    ...colors,
    background: colors.backgroundLight,
    surface: '#FFFFFF',
    textPrimary: '#0F0F1A',
    textSecondary: '#4A4A5A',
  },
  typography,
  fontFamilies,
  spacing,
  radius,
  shadows,
  isDark: false,
}

export type Theme = typeof darkTheme

export { colors, typography, fontFamilies, spacing, radius, shadows }
