import React, { memo, useRef, useState, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, ListRenderItem } from 'react-native'
import LottieView from 'lottie-react-native'
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { setHasSeenOnboarding } from '@store/appSlice'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'

const { width, height } = Dimensions.get('window')
type Nav = NativeStackNavigationProp<AuthStackParamList>

interface Slide {
  id: string
  titleKey: string
  descKey: string
  animation: ReturnType<typeof require>
}

const SLIDES: Slide[] = [
  {
    id: '1',
    titleKey: 'onboarding.slide1Title',
    descKey: 'onboarding.slide1Desc',
    animation: require('@assets/animations/onboarding-1.json'),
  },
  {
    id: '2',
    titleKey: 'onboarding.slide2Title',
    descKey: 'onboarding.slide2Desc',
    animation: require('@assets/animations/onboarding-2.json'),
  },
  {
    id: '3',
    titleKey: 'onboarding.slide3Title',
    descKey: 'onboarding.slide3Desc',
    animation: require('@assets/animations/onboarding-3.json'),
  },
  {
    id: '4',
    titleKey: 'onboarding.slide4Title',
    descKey: 'onboarding.slide4Desc',
    animation: require('@assets/animations/onboarding-4.json'),
  },
]

const OnboardingCarousel: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation<Nav>()
  const dispatch = useAppDispatch()
  const flatListRef = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useSharedValue(0)

  const handleNext = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
      setCurrentIndex(prev => prev + 1)
    } else {
      dispatch(setHasSeenOnboarding(true))
      navigation.replace(ROUTES.LANGUAGE_SELECTION)
    }
  }, [currentIndex, dispatch, navigation])

  const handleSkip = useCallback(() => {
    dispatch(setHasSeenOnboarding(true))
    navigation.replace(ROUTES.LANGUAGE_SELECTION)
  }, [dispatch, navigation])

  const renderSlide: ListRenderItem<Slide> = useCallback(
    ({ item }) => (
      <View style={[styles.slide, { width }]}>
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={styles.animation}
          resizeMode="contain"
        />
        <Text style={[typography.h2, styles.title, { color: colors.textPrimary }]}>
          {t(item.titleKey)}
        </Text>
        <Text style={[typography.body1, styles.desc, { color: colors.textSecondary }]}>
          {t(item.descKey)}
        </Text>
      </View>
    ),
    [t, colors, typography],
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[typography.label, { color: colors.textMuted }]}>{t('onboarding.skip' as never) ?? 'Skip'}</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={e => {
          scrollX.value = e.nativeEvent.contentOffset.x
        }}
        onMomentumScrollEnd={e => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? colors.primary : colors.border,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.75}
        >
          <Text style={[typography.button, { color: colors.textInverse }]}>
            {currentIndex === SLIDES.length - 1 ? t('onboarding.getStarted') : t('common.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipButton: { position: 'absolute', top: 56, right: 24, zIndex: 10 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  animation: { width: width * 0.8, height: height * 0.4 },
  title: { textAlign: 'center', marginTop: 32, marginBottom: 16 },
  desc: { textAlign: 'center', lineHeight: 26 },
  footer: { padding: 32, alignItems: 'center', gap: 24 },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  nextButton: { width: '100%', height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
})

export default OnboardingCarousel
