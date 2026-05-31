import React, { memo, useEffect } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolateColor } from 'react-native-reanimated'
import { useTheme } from '@shared/hooks/useTheme'

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: ViewStyle
}

const Skeleton: React.FC<SkeletonProps> = memo(({ width = '100%', height = 16, borderRadius = 8, style }) => {
  const { colors } = useTheme()
  const shimmer = useSharedValue(0)

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [shimmer])

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      shimmer.value,
      [0, 1],
      [colors.surface, colors.surfaceHover],
    ),
  }))

  return (
    <Animated.View
      style={[{ width: width as number, height, borderRadius }, animatedStyle, style]}
    />
  )
})

export const ProductCardSkeleton: React.FC = memo(() => {
  const { colors } = useTheme()
  return (
    <View style={[skeletonStyles.card, { backgroundColor: colors.surface }]}>
      <Skeleton height={180} borderRadius={8} />
      <View style={skeletonStyles.content}>
        <Skeleton height={14} width="80%" />
        <Skeleton height={14} width="60%" style={{ marginTop: 8 }} />
        <Skeleton height={18} width="40%" style={{ marginTop: 8 }} />
      </View>
    </View>
  )
})

const skeletonStyles = StyleSheet.create({
  card: { borderRadius: 12, overflow: 'hidden', margin: 6 },
  content: { padding: 12 },
})

export default Skeleton
