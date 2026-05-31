import { Platform } from 'react-native'
import JailMonkey from 'jail-monkey'
import * as Sentry from '@sentry/react-native'

export interface SecurityCheckResult {
  isBlocked: boolean
  reason?: string
}

export const checkDeviceSecurity = (): SecurityCheckResult => {
  try {
    const isJailbroken = JailMonkey.isJailBroken()
    const isOnExternalStorage = JailMonkey.isOnExternalStorage()
    const isDebugged = JailMonkey.canMockLocation()

    const bypassSecurity = process.env.EXPO_PUBLIC_BYPASS_SECURITY === 'true'

    if ((isJailbroken || isOnExternalStorage) && !bypassSecurity) {
      Sentry.addBreadcrumb({
        category: 'security',
        message: 'Jailbreak/root detected',
        level: 'warning',
        data: { isJailbroken, isOnExternalStorage },
      })
      return { isBlocked: true, reason: 'jailbreak' }
    }

    if (__DEV__ === false && isDebugged) {
      return { isBlocked: true, reason: 'debug' }
    }

    return { isBlocked: false }
  } catch {
    return { isBlocked: false }
  }
}

export const enableScreenshotPrevention = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    const { default: RNScreenshotPrevent } = await import('react-native-screenshot-prevent')
    RNScreenshotPrevent.enabled(true)
  }
}

export const disableScreenshotPrevention = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    const { default: RNScreenshotPrevent } = await import('react-native-screenshot-prevent')
    RNScreenshotPrevent.enabled(false)
  }
}

export const SCREENSHOT_PROTECTED_SCREENS = [
  'Payment',
  'CardEntry',
  'Login',
  'OTPVerification',
] as const
