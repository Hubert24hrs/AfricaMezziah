import Constants from 'expo-constants'

const extra = Constants.expoConfig?.extra ?? {}

export const CONFIG = {
  API_BASE_URL: (extra.apiBaseUrl as string) ?? 'https://api.africamezziah.com',
  WS_URL: (extra.wsUrl as string) ?? 'wss://api.africamezziah.com',
  HMAC_SECRET: (extra.hmacSecret as string) ?? '',
  PAYSTACK_PUBLIC_KEY: (extra.paystackPublicKey as string) ?? '',
  FLUTTERWAVE_PUBLIC_KEY: (extra.flutterwavePublicKey as string) ?? '',
  STRIPE_PUBLISHABLE_KEY: (extra.stripePublishableKey as string) ?? '',
  SENTRY_DSN: (extra.sentryDsn as string) ?? '',
  SESSION_TIMEOUT_MS: 30 * 60 * 1000,
  TOKEN_REFRESH_BUFFER_MS: 60 * 1000,
  MAX_BIOMETRIC_FAILURES: 3,
  CACHE_TTL_MS: 24 * 60 * 60 * 1000,
  FREE_SHIPPING_THRESHOLD_NGN: 15000,
  SUPPORTED_CURRENCIES: ['NGN', 'USD', 'GBP', 'EUR', 'KES', 'GHS'],
  DEFAULT_CURRENCY: 'NGN',
  IMAGE_CDN_BASE: 'https://cdn.africamezziah.com',
} as const
