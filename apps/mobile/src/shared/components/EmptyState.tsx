import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'
import Button from './Button'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = memo(({ icon = '📭', title, description, actionLabel, onAction }) => {
  const { colors } = useTheme()
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {description && <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} variant="primary" style={styles.button} />
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
