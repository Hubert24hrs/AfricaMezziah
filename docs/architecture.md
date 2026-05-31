# Architecture

## Pattern
Feature-Based Clean Architecture. Each feature is fully self-contained.

## State Management
- **Redux Toolkit** for global state (auth session, cart count, theme, user prefs)
- **RTK Query** for all server data (products, orders, catalog) — auto caching, re-fetching, optimistic updates
- **Local component state** (useState) for UI-only state (modal open, input value)
- **MMKV** for persisted non-sensitive preferences (theme, language, recent searches)
- **Keychain** for tokens ONLY

## Navigation
```
RootNavigator (Stack)
├── AuthNavigator (Stack) — shown when unauthenticated
│   ├── SplashScreen
│   ├── OnboardingCarousel
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── OTPVerificationScreen
│   └── ForgotPasswordScreen
└── MainTabNavigator (Bottom Tabs) — shown when authenticated
    ├── Home Tab (Stack)
    │   ├── HomeScreen
    │   ├── CategoryScreen
    │   ├── ProductListScreen
    │   ├── ProductDetailScreen
    │   └── ThreeDViewerScreen
    ├── Discover Tab (Stack)
    │   ├── SearchScreen
    │   ├── SearchResultsScreen
    │   └── VisualSearchScreen
    ├── Live Tab (Stack)
    │   ├── LiveStreamListScreen
    │   └── LiveStreamViewerScreen
    ├── Cart Tab (Stack)  [badge]
    │   ├── CartScreen
    │   ├── CheckoutScreen
    │   ├── AddressScreen
    │   ├── PaymentScreen
    │   └── OrderConfirmationScreen
    └── Profile Tab (Stack)
        ├── ProfileScreen
        ├── OrdersScreen
        ├── OrderDetailScreen
        ├── WishlistScreen
        ├── AIAssistantScreen
        ├── NotificationsScreen
        └── [all settings screens]
```

## API Layer (RTK Query slices)
```
store/api/
  authApi.ts       — login, register, refresh, OTP, social auth, sessions
  productsApi.ts   — catalog, detail, reviews, search, visual search
  cartApi.ts       — get cart, add/update/remove, apply coupon
  ordersApi.ts     — list, detail, tracking, return
  userApi.ts       — profile, addresses, wishlist, payment methods
  paymentsApi.ts   — initiate, verify, methods CRUD
  aiApi.ts         — chat, recommendations
  liveApi.ts       — streams list, stream detail
```

## Axios Client (`services/apiClient.ts`)
```ts
// Interceptors:
// Request: attach Bearer token from Keychain
// Response 401: attempt token refresh, retry once, else logout
// Response error: log to Sentry (sanitized), surface friendly error
// All requests: HMAC-SHA256 signature header
```

## Offline Strategy
- Product catalog: cached in MMKV for 24h (stale-while-revalidate via RTK Query)
- Wishlist: local MMKV copy, synced on reconnect
- Cart: MMKV for guests, server-synced for authenticated users
- Failed orders: queued for retry via NetInfo listener

## Performance
- FlashList for ALL lists (never FlatList)
- react-native-fast-image for all product images (CDN URLs)
- React.memo on all list item components
- useMemo for derived data, useCallback for handlers passed as props
- Dynamic import for ThreeDViewerScreen and AIAssistantScreen (heavy)
- Image lazy loading with shimmer placeholder

## Error Handling
- RTK Query `isError` + `error` on every data fetch
- Error boundary at each feature root
- Global error handler in Axios interceptor → Sentry
- User-facing: toast/snackbar for non-critical, full-screen error for critical
- Retry logic: RTK Query `retry` utility for transient network errors
