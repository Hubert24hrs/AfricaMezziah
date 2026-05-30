import React, { memo, useRef, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { completeOnboarding } from '@features/auth/authSlice'
import { ROUTES } from '@shared/constants/routes'
import Button from '@shared/components/Button'

const { width } = Dimensions.get('window')

const SLIDES = [
  { id: '1', title: 'African Elegance', subtitle: 'Discover premium African fashion from top designers worldwide', emoji: '👗' },
  { id: '2', title: 'Shop Your Style', subtitle: 'Browse thousands of curated African fashion pieces for every occasion', emoji: '🛍️' },
  { id: '3', title: 'Fast Delivery', subtitle: 'Express shipping to Nigeria, Ghana, Kenya, South Africa and worldwide', emoji: '🚀' },
  { id: '4', title: 'Your AI Stylist', subtitle: 'Get personalized outfit recommendations powered by advanced AI', emoji: '✨' },
]

const OnboardingCarousel: React.FC = memo(() => {
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const [index, setIndex] = useState(0)
  const ref = useRef<FlatList>(null)

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1, animated: true })
      setIndex(i => i + 1)
    } else {
      dispatch(completeOnboarding())
      navigation.replace(ROUTES.LANGUAGE_SELECTION)
    }
  }

  const handleSkip = () => {
    dispatch(completeOnboarding())
    navigation.replace(ROUTES.LANGUAGE_SELECTION)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button
          label={index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.btn}
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  skip: { position: 'absolute', top: 52, right: 24, zIndex: 10 },
  skipText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#B0B0C3' },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emoji: { fontSize: 80, marginBottom: 32 },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 32, color: '#C9A84C', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#B0B0C3', textAlign: 'center', lineHeight: 26 },
  footer: { paddingBottom: 48, paddingHorizontal: 32, alignItems: 'center', gap: 24 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6B6B80' },
  dotActive: { backgroundColor: '#C9A84C', width: 24 },
  btn: { width: '100%' },
})

export default OnboardingCarousel
