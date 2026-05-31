import CryptoJS from 'react-native-crypto-js'

const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET ?? ''

export interface SignedRequest {
  signature: string
  timestamp: string
}

export const signRequest = (
  method: string,
  path: string,
  body: string,
): SignedRequest => {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const payload = `${method}${path}${timestamp}${body}`
  const signature = CryptoJS.HmacSHA256(payload, CLIENT_SECRET).toString(CryptoJS.enc.Hex)
  return { signature, timestamp }
}
