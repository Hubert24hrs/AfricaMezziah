const CryptoJS = {
  HmacSHA256: (_msg: string, _key: string) => ({ toString: (_enc?: unknown) => 'web-hmac-noop' }),
  enc: { Hex: 'Hex', Base64: 'Base64' },
}
export default CryptoJS
