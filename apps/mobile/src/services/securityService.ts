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

export const preventScreenshot = async (screenName: string): Promise<void> => {
  if (Platform.OS === 'android') {
    try {
      const { default: RNScreenshotsPreventor } = await import('react-native-screens-screenshot-prevent' as string)
      RNScreenshotsPreventor.enableSecureView()
    } catch {
      // module optional — skip
    }
  }
  Sentry.addBreadcrumb({ message: `Screenshot prevention applied: ${screenName}`, level: 'info' })
}

export const allowScreenshot = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    try {
      const { default: RNScreenshotsPreventor } = await import('react-native-screens-screenshot-prevent' as string)
      RNScreenshotsPreventor.disableSecureView()
    } catch {
      // module optional — skip
    }
  }
}
