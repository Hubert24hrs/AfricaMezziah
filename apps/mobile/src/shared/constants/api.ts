export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',
  GOOGLE_AUTH: '/auth/google',
  APPLE_AUTH: '/auth/apple',
  ENABLE_MFA: '/auth/enable-mfa',
  VERIFY_MFA: '/auth/verify-mfa',
  SESSIONS: '/auth/sessions',

  // Products
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  VISUAL_SEARCH: '/search/visual',

  // Cart
  CART: '/cart',
  CART_ITEMS: '/cart/items',
  APPLY_COUPON: '/cart/apply-coupon',
  REMOVE_COUPON: '/cart/remove-coupon',
  SHIPPING_ESTIMATE: '/cart/shipping-estimate',

  // Orders
  ORDERS: '/orders',

  // User
  ME: '/users/me',
  ADDRESSES: '/users/me/addresses',
  WISHLIST: '/users/me/wishlist',
  LOYALTY: '/users/me/loyalty',
  REFERRAL: '/users/me/referral',

  // Payments
  PAYMENT_INITIATE: '/payments/initiate',
  PAYMENT_VERIFY: '/payments/verify',
  PAYMENT_METHODS: '/payments/methods',
  WALLET: '/payments/wallet',

  // AI
  AI_CHAT: '/ai/chat',
  AI_RECOMMENDATIONS: '/ai/recommendations',
  AI_OUTFIT_SUGGESTIONS: '/ai/outfit-suggestions',

  // Live
  LIVE_STREAMS: '/live/streams',

  // Notifications
  NOTIFICATIONS: '/notifications',
  DEVICE_TOKEN: '/notifications/device-token',
} as const
