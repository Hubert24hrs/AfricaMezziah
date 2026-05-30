import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'
import Button from './Button'

interface EmptyStateProps {
  icon?: string
  title: string
  /** `subtitle` is accepted as an alias for `description`. */
  description?: string
  subtitle?: string
  /** `ctaLabel` is accepted as an alias for `actionLabel`. */
  actionLabel?: string
  ctaLabel?: string
  /** `onCta` is accepted as an alias for `onAction`. */
  onAction?: () => void
  onCta?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = memo(({ icon = '📭', title, description, subtitle, actionLabel, ctaLabel, onAction, onCta }) => {
  const { colors } = useTheme()
  const desc = description ?? subtitle
  const label = actionLabel ?? ctaLabel
  const action = onAction ?? onCta
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {desc && <Text style={[styles.description, { color: colors.textSecondary }]}>{desc}</Text>}
      {label && action && (
        <Button label={label} onPress={action} variant="primary" style={styles.button} />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 18, textAlign: 'center', marginBottom: 8 },
  description: { fontFamily: 'Poppins-Regular', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  button: { marginTop: 8 },
})

export default EmptyState
