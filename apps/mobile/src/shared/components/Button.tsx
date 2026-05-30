import React, { memo, useCallback } from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import * as Haptics from 'expo-haptics'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme } from '@shared/hooks/useTheme'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps {
  /** Button text. `title` is accepted as an alias for `label`. */
  label?: string
  title?: string
  onPress: () => void
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  fullWidth?: boolean
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const Button: React.FC<ButtonProps> = memo(({
  label, title, onPress, variant = 'primary', loading = false, disabled = false, style, textStyle, fullWidth = false,
}) => {
  const text = label ?? title ?? ''
  const { colors, radius } = useTheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.96, {}, () => { scale.value = withSpring(1) })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }, [onPress, scale])

  const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: { backgroundColor: colors.primary, ...styles.goldGlow },
      text: { color: colors.textInverse },
    },
    secondary: {
      container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
      text: { color: colors.primary },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: colors.textPrimary },
    },
    danger: {
      container: { backgroundColor: colors.accent },
      text: { color: '#FFFFFF' },
    },
  }

  const v = variantStyles[variant]

  return (
    <AnimatedTouchable
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        { borderRadius: radius.full },
        v.container,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color} size="small" />
      ) : (
        <Text style={[styles.label, v.text, textStyle]}>{text}</Text>
      )}
    </AnimatedTouchable>
  )
})

const styles = StyleSheet.create({
  base: { height: 48, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  disabled: { opacity: 0.4 },
  fullWidth: { width: '100%' },
  goldGlow: { shadowColor: '#C9A84C', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
})

export default Button
