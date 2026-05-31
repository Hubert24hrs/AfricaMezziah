import React, { memo, useEffect, useRef } from 'react'
import { View, StyleSheet, Animated, Dimensions } from 'react-native'
import LottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAppSelector } from '@store/store'
import { colors } from '@shared/theme'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'

const { width } = Dimensions.get('window')
type Nav = NativeStackNavigationProp<AuthStackParamList>

const SplashScreen: React.FC = memo(() => {
  const navigation = useNavigation<Nav>()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const hasSeenOnboarding = useAppSelector(state => state.app.hasSeenOnboarding)
  const opacity = useRef(new Animated.Value(0)).current
  const lottieRef = useRef<LottieView>(null)

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        return
      }
      if (!hasSeenOnboarding) {
        navigation.replace(ROUTES.ONBOARDING)
      } else {
        navigation.replace(ROUTES.LOGIN)
      }
    }, 2800)

    return () => clearTimeout(timer)
  }, [isAuthenticated, hasSeenOnboarding, navigation, opacity])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        <LottieView
          ref={lottieRef}
          source={require('@assets/animations/logo-splash.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { alignItems: 'center' },
  lottie: { width: width * 0.6, height: width * 0.6 },
})

export default SplashScreen
