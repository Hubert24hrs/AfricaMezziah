// Web shim – uses in-memory store (no secure keychain on web)
const store: Record<string, string> = {}

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  store['access'] = accessToken
  store['refresh'] = refreshToken
}

export const getAccessToken = async (): Promise<string | null> => store['access'] ?? null

export const getRefreshToken = async (): Promise<string | null> => store['refresh'] ?? null

export const clearTokens = async (): Promise<void> => {
  delete store['access']
  delete store['refresh']
}

export const hasStoredCredentials = async (): Promise<boolean> => !!store['access']
