import React, { useEffect, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'
import * as Sentry from '@sentry/react-native'
import { store, useAppDispatch, useAppSelector } from '@store/store'
import { checkDeviceSecurity } from '@services/securityService'
import { setSecurityBlocked } from '@store/appSlice'
import RootNavigator from '@navigation/RootNavigator'
import '@i18n/index'

SplashScreen.preventAutoHideAsync()

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  tracesSampleRate: 0.2,
  beforeSend(event) {
    if (event.request?.data) {
      const data = event.request.data as Record<string, unknown>
      delete data['password']
      delete data['token']
      delete data['card']
      delete data['cvv']
    }
    return event
  },
})

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch()
  const isSecurityBlocked = useAppSelector(state => state.app.isSecurityBlocked)

  const init = useCallback(async () => {
    const securityResult = checkDeviceSecurity()
    if (securityResult.isBlocked) {
      dispatch(setSecurityBlocked(true))
    }

    await Font.loadAsync({
      'PlayfairDisplay-Bold': require('./src/assets/fonts/PlayfairDisplay-Bold.ttf'),
      'PlayfairDisplay-SemiBold': require('./src/assets/fonts/PlayfairDisplay-SemiBold.ttf'),
      'PlayfairDisplay-Regular': require('./src/assets/fonts/PlayfairDisplay-Regular.ttf'),
      'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
      'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
      'Poppins-Medium': require('./src/assets/fonts/Poppins-Medium.ttf'),
      'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
      'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
      'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
      'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
    })

    await SplashScreen.hideAsync()
  }, [dispatch])

  useEffect(() => {
    void init()
  }, [init])

  if (isSecurityBlocked) {
    return (
      <View style={styles.securityBlock}>
        <Text style={styles.securityTitle}>Security Warning</Text>
        <Text style={styles.securityMessage}>
          This device appears to be jailbroken or rooted. For your security,
          Africa Mezziah cannot run on this device.
        </Text>
      </View>
    )
  }

  return <RootNavigator />
}

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.flex}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  securityBlock: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  securityTitle: {
    color: '#FF4757',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  securityMessage: {
    color: '#B0B0C3',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
})
