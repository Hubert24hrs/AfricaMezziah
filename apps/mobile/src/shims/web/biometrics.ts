export const BiometryTypes = { TouchID: 'TouchID', FaceID: 'FaceID', Biometrics: 'Biometrics' }
export default class ReactNativeBiometrics {
  isSensorAvailable = async () => ({ available: false, biometryType: undefined })
  simplePrompt = async (_opts: unknown) => ({ success: false, error: 'Not available on web' })
  createKeys = async () => ({ publicKey: '' })
}
