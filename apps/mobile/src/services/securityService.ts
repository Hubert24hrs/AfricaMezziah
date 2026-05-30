import { Platform } from 'react-native'
import * as Sentry from '@sentry/react-native'

let jailMonkeyModule: { isJailBroken: () => boolean; isOnExternalStorage: () => boolean } | null = null

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  jailMonkeyModule = require('jail-monkey').default
} catch {
  // jail-monkey not available in Expo Go — skip
}

export type SecurityResult = { safe: boolean; reason?: string }

export const checkDeviceSecurity = (): SecurityResult => {
  if (!jailMonkeyModule) return { safe: true }
  try {
    if (jailMonkeyModule.isJailBroken()) {
      Sentry.addBreadcrumb({ message: 'Jailbroken device detected', level: 'warning' })
      return { safe: false, reason: 'jailbreak' }
    }
    if (Platform.OS === 'android' && jailMonkeyModule.isOnExternalStorage()) {
      return { safe: false, reason: 'external_storage' }
    }
    return { safe: true }
  } catch {
    return { safe: true }
  }
}

// Optional native module — loaded lazily so the app still runs without it (e.g. Expo Go).
const getScreenshotPreventor = (): { enableSecureView: () => void; disableSecureView: () => void } | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-screens-screenshot-prevent').default
  } catch {
    return null
  }
}

export const preventScreenshot = async (screenName: string): Promise<void> => {
  if (Platform.OS === 'android') {
    getScreenshotPreventor()?.enableSecureView()
  }
  Sentry.addBreadcrumb({ message: `Screenshot prevention applied: ${screenName}`, level: 'info' })
}

export const allowScreenshot = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    getScreenshotPreventor()?.disableSecureView()
  }
}
