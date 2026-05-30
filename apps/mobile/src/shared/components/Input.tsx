import React, { memo, useCallback, useState } from 'react'
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'

interface InputProps extends TextInputProps {
  label: string
  error?: string
  success?: boolean
  secureEntry?: boolean
  leftIcon?: string
}

const Input: React.FC<InputProps> = memo(({ label, error, success, secureEntry, leftIcon, onFocus, onBlur, ...rest }) => {
  const { colors, radius } = useTheme()
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const labelTop = useSharedValue(16)
  const labelSize = useSharedValue(16)
  const shakeX = useSharedValue(0)

  const labelStyle = useAnimatedStyle(() => ({
    top: labelTop.value,
    fontSize: labelSize.value,
    color: focused ? colors.primary : colors.textMuted,
  }))

  const handleFocus = useCallback((e: any) => {
    setFocused(true)
    labelTop.value = withSpring(-8)
    labelSize.value = withSpring(12)
    onFocus?.(e)
  }, [labelTop, labelSize, onFocus])

  const handleBlur = useCallback((e: any) => {
    setFocused(false)
    if (!rest.value) {
      labelTop.value = withSpring(16)
      labelSize.value = withSpring(16)
    }
    onBlur?.(e)
  }, [labelTop, labelSize, onBlur, rest.value])

  React.useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withSpring(8), withSpring(-8), withSpring(6), withSpring(-6), withSpring(0)
      )
    }
  }, [error, shakeX])

  const containerStyle = {
    borderColor: error ? colors.error : focused ? colors.primary : success ? colors.success : colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  }

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateX: shakeX }] }]}>
      <View style={[styles.container, containerStyle]}>
        {leftIcon && <Ionicons name={leftIcon as any} size={20} color={colors.textMuted} style={styles.leftIcon} />}
        <View style={styles.inputWrapper}>
          <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
          <TextInput
            {...rest}
            style={[styles.input, { color: colors.textPrimary, fontFamily: 'Poppins-Regular' }]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureEntry && !showPassword}
            placeholderTextColor={colors.textMuted}
          />
        </View>
        {secureEntry && (
          <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.rightIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
        {success && !secureEntry && (
          <View style={styles.rightIcon}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
        )}
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  container: { borderWidth: 1.5, minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  inputWrapper: { flex: 1, paddingTop: 20, paddingBottom: 8 },
  label: { position: 'absolute', left: 0, fontFamily: 'Poppins-Regular' },
  input: { fontSize: 16, padding: 0, marginTop: 4 },
  leftIcon: { marginRight: 12 },
  rightIcon: { paddingLeft: 8 },
  errorText: { fontFamily: 'Poppins-Regular', fontSize: 12, marginTop: 4, marginLeft: 4 },
})

export default Input
