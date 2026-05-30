import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'

interface BannerItem {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
  ctaLabel: string
  onPress: () => void
}

interface HeroBannerProps {
  items: BannerItem[]
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const HeroBanner: React.FC<HeroBannerProps> = memo(({ items }) => {
  const { colors } = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % items.length
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true })
      setActiveIndex(next)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeIndex, items.length])

  const handleScroll = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setActiveIndex(index)
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {items.map(item => (
          <View key={item.id} style={styles.slide}>
            <FastImage source={{ uri: item.imageUrl }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
              <TouchableOpacity
                style={[styles.cta, { backgroundColor: colors.primary }]}
                onPress={item.onPress}
                activeOpacity={0.75}
              >
                <Text style={styles.ctaText}>{item.ctaLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {items.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: i === activeIndex ? colors.primary : colors.textMuted }]}
          />
        ))}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { height: 280 },
  slide: { width: SCREEN_WIDTH },
  image: { width: SCREEN_WIDTH, height: 280 },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 32,
    background: 'transparent',
    backgroundImage: undefined,
  },
  title: { color: '#fff', fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Poppins-Regular', fontSize: 14, marginBottom: 12 },
  cta: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  ctaText: { color: '#0F0F1A', fontFamily: 'Poppins-SemiBold', fontSize: 14 },
  dots: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
})

export default HeroBanner
