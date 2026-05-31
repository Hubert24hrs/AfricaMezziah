import React, { memo, useCallback } from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import { LinearGradient } from 'react-native-linear-gradient'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@shared/hooks/useTheme'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  icon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = memo(({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { colors, typography, shadows } = useTheme()

  const handlePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }, [onPress])

  const isPrimary = variant === 'primary'
  const isDanger = variant === 'danger'
  const isSecondary = variant === 'secondary'
  const isGhost = variant === 'ghost'

  const containerStyle: ViewStyle = {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
    ...(isSecondary && { borderWidth: 1.5, borderColor: colors.primary }),
    ...(isGhost && {}),
    ...(isDanger && { backgroundColor: colors.accent }),
    ...(shadows.goldGlow as ViewStyle),
    ...(style as ViewStyle),
  }

  const labelStyle: TextStyle = {
    ...(typography.button as TextStyle),
    color: isPrimary ? colors.textInverse : isSecondary ? colors.primary : isDanger ? colors.textPrimary : colors.textPrimary,
    ...(textStyle as TextStyle),
  }

  const content = loading ? (
    <ActivityIndicator color={isPrimary ? colors.textInverse : colors.primary} />
  ) : (
    <>
      {icon}
      <Text style={labelStyle}>{label}</Text>
    </>
  )

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.75}
        style={[containerStyle, style]}
      >
        <LinearGradient
          colors={[colors.goldGradientStart, colors.goldGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[containerStyle, style]}
    >
      {content}
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
})

export default Button
