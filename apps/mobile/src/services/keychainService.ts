import * as Keychain from 'react-native-keychain'

const SERVICE_ACCESS = 'africa_mezziah_access_token'
const SERVICE_REFRESH = 'africa_mezziah_refresh_token'
const USERNAME = 'user'

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  await Promise.all([
    Keychain.setGenericPassword(USERNAME, accessToken, {
      service: SERVICE_ACCESS,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
    Keychain.setGenericPassword(USERNAME, refreshToken, {
      service: SERVICE_REFRESH,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  ])
}

export const getAccessToken = async (): Promise<string | null> => {
  const result = await Keychain.getGenericPassword({ service: SERVICE_ACCESS })
  return result ? result.password : null
}

export const getRefreshToken = async (): Promise<string | null> => {
  const result = await Keychain.getGenericPassword({ service: SERVICE_REFRESH })
  return result ? result.password : null
}

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    Keychain.resetGenericPassword({ service: SERVICE_ACCESS }),
    Keychain.resetGenericPassword({ service: SERVICE_REFRESH }),
  ])
}

export const hasStoredCredentials = async (): Promise<boolean> => {
  const result = await Keychain.getGenericPassword({ service: SERVICE_ACCESS })
  return !!result
}
