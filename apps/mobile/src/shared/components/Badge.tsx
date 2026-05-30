import React, { memo } from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'

type BadgeType = 'discount' | 'new' | 'hot' | 'flashSale' | 'outOfStock'
interface BadgeProps { type: BadgeType; label: string; style?: ViewStyle }

const Badge: React.FC<BadgeProps> = memo(({ type, label, style }) => {
  const { colors } = useTheme()
  const config: Record<BadgeType, { bg: string; textColor: string; icon?: string }> = {
    discount: { bg: colors.accent, textColor: '#fff' },
    new: { bg: colors.success, textColor: '#fff' },
    hot: { bg: '#FFB830', textColor: '#fff', icon: 'flame' },
    flashSale: { bg: colors.accent, textColor: '#fff', icon: 'flash' },
    outOfStock: { bg: colors.textMuted, textColor: '#fff' },
  }
  const { bg, textColor, icon } = config[type]
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <Ionicons name={icon as any} size={10} color={textColor} />}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, gap: 3 },
  label: { fontFamily: 'Poppins-SemiBold', fontSize: 10 },
})

export default Badge
