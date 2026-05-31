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
  TAB_HOME: 'HomeTab',
  TAB_DISCOVER: 'DiscoverTab',
  TAB_LIVE: 'LiveTab',
  TAB_CART: 'CartTab',
  TAB_PROFILE: 'ProfileTab',

  // Home Stack
  HOME: 'Home',
  CATEGORY: 'Category',
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
  THREE_D_VIEWER: 'ThreeDViewer',

  // Discover Stack
  SEARCH: 'Search',
  SEARCH_RESULTS: 'SearchResults',
  VISUAL_SEARCH: 'VisualSearch',

  // Live Stack
  LIVE_LIST: 'LiveStreamList',
  LIVE_VIEWER: 'LiveStreamViewer',

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
  ADDRESS_BOOK: 'AddressBook',
  PAYMENT_METHODS: 'PaymentMethods',
  SECURITY_SETTINGS: 'SecuritySettings',
  NOTIFICATIONS_SETTINGS: 'NotificationsSettings',
  PRIVACY_SETTINGS: 'PrivacySettings',
  THEME_SCREEN: 'ThemeScreen',
  LANGUAGE_SCREEN: 'LanguageScreen',
  HELP_CENTER: 'HelpCenter',
  ABOUT: 'About',
  AI_ASSISTANT: 'AIAssistant',
  NOTIFICATIONS: 'Notifications',
  REVIEWS: 'Reviews',
  SIZE_GUIDE: 'SizeGuide',
} as const

export type RouteNames = (typeof ROUTES)[keyof typeof ROUTES]
