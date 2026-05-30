import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shared/hooks/useTheme'
import type { HeroBanner as HeroBannerData } from '@store/api/homeApi'

interface HeroBannerProps {
  banners: HeroBannerData[]
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const HeroBanner: React.FC<HeroBannerProps> = memo(({ banners }) => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % banners.length
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true })
      setActiveIndex(next)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeIndex, banners.length])

  const handleScroll = useCallback((e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setActiveIndex(index)
  }, [])

  const handleCta = useCallback((route: string, params?: Record<string, string>) => {
    navigation.navigate(route, params)
  }, [navigation])

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {banners.map(item => (
          <View key={item.id} style={styles.slide}>
            <FastImage source={{ uri: item.imageUrl }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
              <TouchableOpacity
                style={[styles.cta, { backgroundColor: colors.primary }]}
                onPress={() => handleCta(item.ctaRoute, item.ctaParams)}
                activeOpacity={0.75}
              >
                <Text style={styles.ctaText}>{item.ctaLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {banners.map((b, i) => (
          <View
            key={b.id}
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
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 32 },
  title: { color: '#fff', fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Poppins-Regular', fontSize: 14, marginBottom: 12 },
  cta: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  ctaText: { color: '#0F0F1A', fontFamily: 'Poppins-SemiBold', fontSize: 14 },
  dots: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
})

export default HeroBanner
