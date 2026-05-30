import React, { memo, useEffect, useRef } from 'react'
import { Animated, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: ViewStyle
}

const Skeleton: React.FC<SkeletonProps> = memo(({ width = '100%', height = 20, borderRadius = 8, style }) => {
  const { colors } = useTheme()
  const shimmer = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start()
  }, [shimmer])

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] })

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as any, height, borderRadius, backgroundColor: colors.surface, opacity },
        style,
      ]}
    />
  )
})

const styles = StyleSheet.create({
  base: {},
})

export default Skeleton
