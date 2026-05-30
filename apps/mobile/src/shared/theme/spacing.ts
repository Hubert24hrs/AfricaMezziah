export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 999,
} as const

export type Spacing = typeof spacing
export type Radius = typeof radius
