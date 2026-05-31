import React, { memo } from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'
import Button from './Button'

interface EmptyStateProps {
  emoji?: string
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  style?: ViewStyle
}

const EmptyState: React.FC<EmptyStateProps> = memo(({
  emoji = '🛍️',
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors, typography } = useTheme()

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[typography.h4, { color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[typography.body2, { color: colors.textSecondary, textAlign: 'center' }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.btn}
        />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 24 },
  btn: { marginTop: 24, width: 200 },
})

export default EmptyState
