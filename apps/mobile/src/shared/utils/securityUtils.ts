import CryptoJS from 'crypto-js'
import { CONFIG } from '@shared/constants/config'

export const generateHmacSignature = (
  method: string,
  path: string,
  timestamp: number,
  body: string,
): string => {
  const message = `${method.toUpperCase()}${path}${timestamp}${body}`
  return CryptoJS.HmacSHA256(message, CONFIG.HMAC_SECRET).toString(CryptoJS.enc.Hex)
}

export const generateRequestTimestamp = (): number => Math.floor(Date.now() / 1000)

export const maskCardNumber = (cardNumber: string): string => {
  const last4 = cardNumber.slice(-4)
  return `•••• •••• •••• ${last4}`
}

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@')
  const maskedLocal = `${local.slice(0, 2)}${'*'.repeat(Math.max(local.length - 4, 2))}${local.slice(-2)}`
  return `${maskedLocal}@${domain}`
}

export const maskPhone = (phone: string): string => {
  if (phone.length < 7) return phone
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}
