import React, { memo, useRef, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import FastImage from 'react-native-fast-image'
import { LinearGradient } from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import type { Banner } from '../home.types'

const { width } = Dimensions.get('window')
const BANNER_HEIGHT = 280

interface HeroBannerProps {
  banners: Banner[]
}

const HeroBanner: React.FC<HeroBannerProps> = memo(({ banners }) => {
  const { colors, typography, radius } = useTheme()
  const { t } = useTranslation()
  const flatListRef = useRef<FlatList>(null)
  const currentIndex = useRef(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length
      flatListRef.current?.scrollToIndex({ index: currentIndex.current, animated: true })
    }, 4000)
    return () => clearInterval(timer)
  }, [banners])

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <FastImage
              source={{ uri: item.imageUrl, priority: FastImage.priority.high }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
            />
            <LinearGradient
              colors={['transparent', 'rgba(15,15,26,0.9)']}
              style={styles.gradient}
            >
              <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: 8 }]}>{item.title}</Text>
              {item.subtitle && (
                <Text style={[typography.body2, { color: colors.textSecondary, marginBottom: 16 }]}>
                  {item.subtitle}
                </Text>
              )}
              <TouchableOpacity
                style={[styles.ctaBtn, { backgroundColor: colors.primary, borderRadius: radius.full }]}
                activeOpacity={0.75}
              >
                <Text style={[typography.label, { color: colors.textInverse }]}>{item.ctaLabel}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { height: BANNER_HEIGHT },
  slide: { height: BANNER_HEIGHT, position: 'relative' },
  image: { width: '100%', height: '100%' },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 28,
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
})

export default HeroBanner
