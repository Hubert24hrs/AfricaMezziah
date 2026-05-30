import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { store } from '@store/store'
import RootNavigator from '@navigation/RootNavigator'
import { checkDeviceSecurity } from '@services/securityService'
import { initI18n } from './src/i18n'
import { StyleSheet } from 'react-native'

initI18n()

export default function App() {
  useEffect(() => {
    checkDeviceSecurity()
  }, [])

  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
