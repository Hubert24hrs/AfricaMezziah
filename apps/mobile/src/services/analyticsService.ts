let firebaseAnalytics: { logEvent: (name: string, params?: Record<string, unknown>) => Promise<void> } | null = null

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  firebaseAnalytics = require('@react-native-firebase/analytics').default()
} catch {
  // Firebase not configured yet
}

let analyticsEnabled = false

export const initAnalytics = (enabled: boolean) => {
  analyticsEnabled = enabled
}

export const logEvent = async (name: string, params?: Record<string, unknown>) => {
  if (!analyticsEnabled || !firebaseAnalytics) return
  try {
    await firebaseAnalytics.logEvent(name, params)
  } catch {
    // non-fatal
  }
}

export const EVENTS = {
  VIEW_PRODUCT: 'view_product',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  VIEW_CATEGORY: 'view_category',
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  VIEW_LIVE_STREAM: 'view_live_stream',
  AI_CHAT: 'ai_chat_message',
} as const
