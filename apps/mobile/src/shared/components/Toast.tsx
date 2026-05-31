import React, { memo, useEffect, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  onDismiss: () => void
  visible: boolean
}

const ICONS: Record<ToastVariant, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
}

const Toast: React.FC<ToastProps> = memo(({ message, variant = 'info', duration = 3000, onDismiss, visible }) => {
  const { colors, typography, radius } = useTheme()
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current

  const show = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 15 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start()
  }, [translateY, opacity])

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, duration: 200, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onDismiss())
  }, [translateY, opacity, onDismiss])

  useEffect(() => {
    if (!visible) return
    show()
    const timer = setTimeout(hide, duration)
    return () => {
      clearTimeout(timer)
    }
  }, [visible, show, hide, duration])

  const variantColors: Record<ToastVariant, string> = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  }

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.surface,
          borderLeftColor: variantColors[variant],
          borderRadius: radius.md,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.icon}>{ICONS[variant]}</Text>
      <Text style={[typography.body2, { color: colors.textPrimary, flex: 1 }]}>{message}</Text>
      <TouchableOpacity onPress={hide} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={{ color: colors.textMuted, fontSize: 18 }}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  icon: { fontSize: 20 },
})

export default Toast
