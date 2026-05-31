import analytics from '@react-native-firebase/analytics'

export const logEvent = async (event: string, params?: Record<string, string | number | boolean>): Promise<void> => {
  if (__DEV__) return
  await analytics().logEvent(event, params)
}

export const logScreenView = async (screenName: string): Promise<void> => {
  if (__DEV__) return
  await analytics().logScreenView({ screen_name: screenName, screen_class: screenName })
}

export const setUserId = async (userId: string): Promise<void> => {
  await analytics().setUserId(userId)
}

export const EVENTS = {
  LOGIN: 'login',
  REGISTER: 'sign_up',
  VIEW_PRODUCT: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  SEARCH: 'search',
  VIEW_LIVE_STREAM: 'view_live_stream',
  SHARE: 'share',
  APPLY_COUPON: 'apply_coupon',
} as const
