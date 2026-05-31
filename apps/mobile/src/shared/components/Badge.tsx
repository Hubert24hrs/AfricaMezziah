import React, { memo } from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'

type BadgeVariant = 'discount' | 'new' | 'hot' | 'flashSale' | 'outOfStock'

interface BadgeProps {
  variant: BadgeVariant
  label?: string
  percent?: number
  style?: ViewStyle
}

const Badge: React.FC<BadgeProps> = memo(({ variant, label, percent, style }) => {
  const { colors, typography } = useTheme()

  const config: Record<BadgeVariant, { bg: string; text: string; icon?: string; displayLabel: string }> = {
    discount: {
      bg: colors.accent,
      text: '#FFFFFF',
      displayLabel: percent ? `-${percent}%` : label ?? '',
    },
    new: {
      bg: colors.success,
      text: '#FFFFFF',
      displayLabel: label ?? 'NEW',
    },
    hot: {
      bg: colors.warning,
      text: '#FFFFFF',
      icon: '🔥',
      displayLabel: label ?? 'HOT',
    },
    flashSale: {
      bg: colors.accent,
      text: '#FFFFFF',
      icon: '⚡',
      displayLabel: label ?? 'FLASH',
    },
    outOfStock: {
      bg: 'rgba(107,107,128,0.8)',
      text: '#FFFFFF',
      displayLabel: label ?? 'SOLD OUT',
    },
  }

  const c = config[variant]

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      {c.icon && <Text style={styles.icon}>{c.icon}</Text>}
      <Text style={[styles.text, typography.overline, { color: c.text }]}>{c.displayLabel}</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 2,
  },
  icon: { fontSize: 10 },
  text: { fontWeight: '700' },
})

export default Badge
