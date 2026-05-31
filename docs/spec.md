# Africa Mezziah – Full Mobile Specification

## Brand
- **Name**: Africa Mezziah
- **Tagline**: Where African Elegance Meets Futuristic Fashion
- **Audience**: Women (primary), Men, Children
- **Aesthetic**: Afrofuturism — African patterns + metallic gold + deep space dark + glassmorphism + neon accents

## Reference Apps
- **SHEIN**: Product density, flash sales, category grid, discount badges, super deals section
- **1688.com**: Category browsing depth, wholesale-style grid, quick factory/seller info

## Target Markets
Nigeria, Ghana, Kenya, South Africa, diaspora worldwide.
Currency: NGN primary, USD/GBP/EUR/KES/GHS supported.

---

## All Screens

### Onboarding Flow
- `SplashScreen` — Lottie logo animation on dark background, African pattern fade-in
- `OnboardingCarousel` — 4 slides with parallax, Lottie per slide, skip + next + get started
- `LanguageSelectionScreen` — picker: English, French, Swahili, Hausa, Yoruba, Igbo
- `ConsentScreen` — GDPR/privacy consent with links

### Auth Flow
- `LoginScreen` — email/password, show/hide, Google, Apple, phone OTP, biometric prompt
- `RegisterScreen` — name, email, phone, password with strength meter, terms checkbox
- `OTPVerificationScreen` — 6-digit code input, auto-submit, resend countdown
- `ForgotPasswordScreen` — email entry + OTP + new password
- `BiometricSetupScreen` — prompt to enable Face ID / fingerprint
- `MFASetupScreen` — QR code for TOTP app, backup codes download

### Home
- `HomeScreen` — see design.md for section list

### Catalog
- `CategoryScreen` — grid of subcategories with hero image
- `ProductListScreen` — infinite scroll grid, filter/sort, toggle view
- `FilterScreen` — bottom sheet: price slider, size, color, brand, rating, material, occasion
- `SortScreen` — bottom sheet: 6 sort options

### Product
- `ProductDetailScreen` — full detail, gallery, color/size selectors, add to cart CTA
- `ThreeDViewerScreen` — Three.js 3D model, rotate/zoom/pan, close button
- `ReviewsScreen` — paginated reviews, rating breakdown chart, photo reviews
- `SizeGuideScreen` — modal with measurement chart per category

### Search
- `SearchScreen` — autocomplete, voice, camera/visual search, recents, trending
- `SearchResultsScreen` — same grid as ProductList with search-specific filters
- `VisualSearchScreen` — camera + gallery picker, TFLite similarity results

### Cart & Checkout
- `CartScreen` — item list, swipe-delete, coupon, order summary, save for later
- `CheckoutScreen` — 4-step wizard (address → payment → review → confirm)
- `AddressScreen` — add/edit address with Maps autocomplete
- `PaymentScreen` — card (tokenized), Paystack, Flutterwave, bank transfer, wallet, COD
- `OrderConfirmationScreen` — Lottie confetti success, order ID, estimated delivery

### Orders
- `OrdersScreen` — tabs: Active / Completed / Cancelled / Returns
- `OrderDetailScreen` — full breakdown, items, shipping, payment, timeline
- `TrackingScreen` — map + step timeline (Processing → Shipped → Out for Delivery → Delivered)
- `ReturnRequestScreen` — reason picker, description, photo upload

### Wishlist
- `WishlistScreen` — grid, move to cart, price drop badge, share, organize into boards

### AI Assistant
- `AIAssistantScreen` — chat UI, GPT-4o via backend, product cards inline, voice input, quick reply chips

### Profile & Settings
- `ProfileScreen` — avatar, name, loyalty points, referral code, account actions
- `EditProfileScreen` — personal info form
- `AddressBookScreen` — list, add/edit/delete/set default
- `PaymentMethodsScreen` — saved cards, add/remove
- `NotificationsSettingsScreen` — toggle per category
- `SecuritySettingsScreen` — change password, active sessions, biometric toggle, MFA
- `PrivacySettingsScreen` — data consent, request deletion, connected accounts
- `LanguageScreen`, `ThemeScreen` — preferences
- `HelpCenterScreen` — searchable FAQ + chat support
- `AboutScreen` — version, terms, privacy, rate app

### Live Shopping
- `LiveStreamListScreen` — upcoming and live streams, category filter
- `LiveStreamViewerScreen` — video player, product cards overlay, live chat, host info

### Notifications
- `NotificationsScreen` — categorized list, swipe dismiss, mark all read, deep link on tap
