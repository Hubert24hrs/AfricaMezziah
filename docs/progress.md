# Build Progress Tracker

Claude Code: check off items as they are completed using [x].

## Phase 1 – Project Foundation
- [ ] `package.json` with all dependencies
- [ ] `tsconfig.json` (strict mode)
- [ ] `babel.config.js`
- [ ] `.eslintrc.js` (airbnb-typescript)
- [ ] `.prettierrc`
- [ ] `metro.config.js`
- [ ] `app.config.ts` (Expo)
- [ ] `.env.example` with all required variables
- [ ] `src/shared/theme/colors.ts`
- [ ] `src/shared/theme/typography.ts`
- [ ] `src/shared/theme/spacing.ts`
- [ ] `src/shared/theme/shadows.ts`
- [ ] `src/shared/theme/index.ts`
- [ ] `src/shared/hooks/useTheme.ts`
- [ ] `src/i18n/index.ts` + `src/i18n/en.json`

## Phase 2 – Navigation & Store
- [ ] `src/store/store.ts`
- [ ] `src/store/rootReducer.ts`
- [ ] `src/services/apiClient.ts` (Axios + interceptors)
- [ ] `src/navigation/RootNavigator.tsx`
- [ ] `src/navigation/AuthNavigator.tsx`
- [ ] `src/navigation/MainTabNavigator.tsx`
- [ ] `src/constants/routes.ts`

## Phase 3 – Security Layer
- [ ] `src/services/securityService.ts` (jailbreak, SSL pin, screenshot)
- [ ] `src/services/keychainService.ts` (token store/retrieve/clear)
- [ ] Axios interceptor: attach token, refresh on 401
- [ ] HMAC request signing utility
- [ ] Jailbreak check on App.tsx mount

## Phase 4 – Auth Feature
- [ ] `src/store/api/authApi.ts` (RTK Query)
- [ ] `src/features/auth/authSlice.ts`
- [ ] `SplashScreen`
- [ ] `OnboardingCarousel`
- [ ] `LanguageSelectionScreen`
- [ ] `ConsentScreen`
- [ ] `LoginScreen`
- [ ] `RegisterScreen`
- [ ] `OTPVerificationScreen`
- [ ] `ForgotPasswordScreen`
- [ ] `BiometricSetupScreen`

## Phase 5 – Shared Components
- [ ] `Button` (all variants)
- [ ] `Input` (floating label, animated)
- [ ] `ProductCard` (2-col grid card)
- [ ] `Badge` (all types)
- [ ] `Skeleton` (shimmer loader)
- [ ] `BottomSheet` wrapper
- [ ] `ErrorBoundary`
- [ ] `EmptyState`
- [ ] `Toast/Snackbar`

## Phase 6 – Home Screen
- [ ] `src/store/api/homeApi.ts`
- [ ] `HomeScreen` with all sections (see design.md)
- [ ] `HeroBanner` component
- [ ] `CategoryGrid` component
- [ ] `FlashSaleStrip` component (countdown timer)
- [ ] `ProductStrip` (reusable horizontal scroll)
- [ ] `MasonryGrid` component

## Phase 7 – Catalog & Search
- [ ] `src/store/api/productsApi.ts`
- [ ] `CategoryScreen`
- [ ] `ProductListScreen` (FlashList grid)
- [ ] `FilterScreen` (bottom sheet)
- [ ] `SortScreen`
- [ ] `SearchScreen`
- [ ] `SearchResultsScreen`
- [ ] `VisualSearchScreen` (camera + TFLite)

## Phase 8 – Product Detail
- [ ] `ProductDetailScreen`
- [ ] `ThreeDViewerScreen` (expo-three)
- [ ] `ReviewsScreen`
- [ ] `SizeGuideScreen`
- [ ] Shared element transition on product image

## Phase 9 – Cart & Checkout
- [ ] `src/store/api/cartApi.ts`
- [ ] `CartScreen`
- [ ] `CheckoutScreen` (4-step wizard)
- [ ] `AddressScreen` (Maps autocomplete)
- [ ] `PaymentScreen` (Paystack + Flutterwave + Stripe)
- [ ] `OrderConfirmationScreen` (Lottie confetti)

## Phase 10 – Orders & Wishlist
- [ ] `src/store/api/ordersApi.ts`
- [ ] `OrdersScreen`
- [ ] `OrderDetailScreen`
- [ ] `TrackingScreen`
- [ ] `ReturnRequestScreen`
- [ ] `WishlistScreen`

## Phase 11 – Profile & Settings
- [ ] `src/store/api/userApi.ts`
- [ ] `ProfileScreen`
- [ ] `EditProfileScreen`
- [ ] `AddressBookScreen`
- [ ] `PaymentMethodsScreen`
- [ ] `SecuritySettingsScreen`
- [ ] `NotificationsSettingsScreen`
- [ ] `PrivacySettingsScreen`
- [ ] `ThemeScreen` + dark/light toggle
- [ ] `LanguageScreen`
- [ ] `HelpCenterScreen`

## Phase 12 – AI Assistant
- [ ] `src/store/api/aiApi.ts`
- [ ] `AIAssistantScreen` (chat UI, GPT-4o via backend)
- [ ] Voice input integration
- [ ] Inline product card in chat messages

## Phase 13 – Live Shopping
- [ ] `LiveStreamListScreen`
- [ ] `LiveStreamViewerScreen`
- [ ] Live chat overlay
- [ ] In-stream product cards

## Phase 14 – Notifications
- [ ] FCM setup (Firebase Cloud Messaging)
- [ ] `NotificationsScreen`
- [ ] Deep link handler per notification type
- [ ] Push notification permission flow

## Phase 15 – Polish & Testing
- [ ] All Lottie animations integrated
- [ ] All haptic feedback integrated
- [ ] All micro-interactions (heart burst, cart bounce, etc.)
- [ ] Dark/light theme fully tested
- [ ] i18n: French, Swahili translations
- [ ] Jest unit tests ≥80% coverage
- [ ] Detox E2E: auth flow, purchase flow
- [ ] Sentry configured and tested
- [ ] Analytics events mapped and fired
- [ ] EAS Build config for dev/staging/prod
- [ ] README.md complete
