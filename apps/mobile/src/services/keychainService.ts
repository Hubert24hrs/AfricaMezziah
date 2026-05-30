import * as Keychain from 'react-native-keychain'

const SERVICE_ACCESS = 'africa_mezziah_access_token'
const SERVICE_REFRESH = 'africa_mezziah_refresh_token'

export const storeAccessToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword('access_token', token, {
    service: SERVICE_ACCESS,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  })
}

export const storeRefreshToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword('refresh_token', token, {
    service: SERVICE_REFRESH,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  })
}

export const getAccessToken = async (): Promise<string | null> => {
  const creds = await Keychain.getGenericPassword({ service: SERVICE_ACCESS })
  return creds ? creds.password : null
}

export const getRefreshToken = async (): Promise<string | null> => {
  const creds = await Keychain.getGenericPassword({ service: SERVICE_REFRESH })
  return creds ? creds.password : null
}

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    Keychain.resetGenericPassword({ service: SERVICE_ACCESS }),
    Keychain.resetGenericPassword({ service: SERVICE_REFRESH }),
  ])
}

export const storeTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  await Promise.all([storeAccessToken(accessToken), storeRefreshToken(refreshToken)])
}
