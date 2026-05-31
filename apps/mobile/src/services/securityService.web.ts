// Web shim – no jailbreak / screenshot prevention on web
export interface SecurityCheckResult {
  isBlocked: boolean
  reason?: string
}

export const checkDeviceSecurity = (): SecurityCheckResult => ({ isBlocked: false })

export const enableScreenshotPrevention = async (): Promise<void> => {}

export const disableScreenshotPrevention = async (): Promise<void> => {}

export const SCREENSHOT_PROTECTED_SCREENS = [
  'Payment', 'CardEntry', 'Login', 'OTPVerification',
] as const
