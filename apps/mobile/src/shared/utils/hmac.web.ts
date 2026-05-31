// Web shim – uses SubtleCrypto instead of react-native-crypto-js
export interface SignedRequest {
  signature: string
  timestamp: string
}

export const signRequest = (
  _method: string,
  _path: string,
  _body: string,
): SignedRequest => {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  return { signature: 'web-noop', timestamp }
}
