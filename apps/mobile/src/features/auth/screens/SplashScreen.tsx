import React, { memo, useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'
import { ROUTES } from '@shared/constants/routes'

const SplashScreen: React.FC = memo(() => {
  const navigation = useNavigation<any>()
  const onboardingComplete = useSelector((state: RootState) => state.auth.onboardingComplete)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.7)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 })
    scale.value = withTiming(1, { duration: 800 })
    const timer = setTimeout(() => {
      navigation.replace(onboardingComplete ? ROUTES.LOGIN : ROUTES.ONBOARDING)
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigation, onboardingComplete, opacity, scale])

  const logoStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }))

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1A" />
      <Animated.Text style={[styles.logo, logoStyle]}>Africa Mezziah</Animated.Text>
      <Animated.Text style={[styles.tagline, logoStyle]}>Where African Elegance Meets Futuristic Fashion</Animated.Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', alignItems: 'center', justifyContent: 'center' },
  logo: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 32, color: '#C9A84C', textAlign: 'center' },
  tagline: { fontFamily: 'Poppins-Regular', fontSize: 13, color: '#B0B0C3', textAlign: 'center', marginTop: 12, paddingHorizontal: 32 },
})

export default SplashScreen
