export const ROUTES = {
  // Auth Stack
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LANGUAGE_SELECTION: 'LanguageSelection',
  CONSENT: 'Consent',
  LOGIN: 'Login',
  REGISTER: 'Register',
  OTP_VERIFICATION: 'OTPVerification',
  FORGOT_PASSWORD: 'ForgotPassword',
  BIOMETRIC_SETUP: 'BiometricSetup',
  MFA_SETUP: 'MFASetup',

  // Main Tabs
  HOME_TAB: 'HomeTab',
  DISCOVER_TAB: 'DiscoverTab',
  LIVE_TAB: 'LiveTab',
  CART_TAB: 'CartTab',
  PROFILE_TAB: 'ProfileTab',

  // Home Stack
  HOME: 'Home',
  CATEGORY: 'Category',
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
  THREE_D_VIEWER: 'ThreeDViewer',
  REVIEWS: 'Reviews',
  SIZE_GUIDE: 'SizeGuide',

  // Discover Stack
  SEARCH: 'Search',
  SEARCH_RESULTS: 'SearchResults',
  VISUAL_SEARCH: 'VisualSearch',

  // Live Stack
  LIVE_STREAM_LIST: 'LiveStreamList',
  LIVE_STREAM_VIEWER: 'LiveStreamViewer',

  // Cart Stack
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  ADDRESS: 'Address',
  PAYMENT: 'Payment',
  ORDER_CONFIRMATION: 'OrderConfirmation',

  // Profile Stack
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  ORDERS: 'Orders',
  ORDER_DETAIL: 'OrderDetail',
  TRACKING: 'Tracking',
  RETURN_REQUEST: 'ReturnRequest',
  WISHLIST: 'Wishlist',
  AI_ASSISTANT: 'AIAssistant',
  NOTIFICATIONS: 'Notifications',
  ADDRESS_BOOK: 'AddressBook',
  PAYMENT_METHODS: 'PaymentMethods',
  SECURITY_SETTINGS: 'SecuritySettings',
  NOTIFICATIONS_SETTINGS: 'NotificationsSettings',
  PRIVACY_SETTINGS: 'PrivacySettings',
  THEME_SETTINGS: 'ThemeSettings',
  LANGUAGE_SETTINGS: 'LanguageSettings',
  HELP_CENTER: 'HelpCenter',
  ABOUT: 'About',
} as const

export type RouteKey = keyof typeof ROUTES
export type RouteName = (typeof ROUTES)[RouteKey]
