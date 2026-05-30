import React, { memo, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  visible: boolean
  onHide: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = memo(({ message, type, visible, onHide, duration = 3000 }) => {
  const { colors } = useTheme()
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.delay(duration),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => onHide())
    }
  }, [visible, duration, opacity, onHide])

  if (!visible) return null

  const bgColor =
    type === 'success' ? colors.success :
    type === 'error' ? colors.error :
    type === 'warning' ? '#FFB830' :
    colors.info

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor, opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 14,
    zIndex: 9999,
  },
  text: { color: '#fff', fontFamily: 'Poppins-Medium', fontSize: 14, textAlign: 'center' },
})

export default Toast
