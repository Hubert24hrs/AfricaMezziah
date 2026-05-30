# Africa Mezziah — Mobile App

Premium African fashion e-commerce app (Afrofuturism aesthetic) built with React Native + Expo.

> Part of the Africa Mezziah monorepo. This package is `apps/mobile`.

## Stack

- **Framework:** React Native 0.74 + Expo SDK 51
- **Language:** TypeScript (strict)
- **Navigation:** React Navigation v6 (bottom tabs + native stacks)
- **State:** Redux Toolkit + RTK Query
- **Styling:** NativeWind + StyleSheet + `@shared/theme`
- **Animations:** Reanimated 3 + Lottie
- **Lists:** FlashList
- **Secure storage:** react-native-keychain (tokens only)
- **Fast storage:** MMKV
- **Forms:** React Hook Form + Zod
- **Payments:** Paystack / Flutterwave / Stripe
- **Crash/Analytics:** Sentry + Firebase

## Prerequisites

1. **Node.js 18+** and npm
2. **Expo account** (free) for cloud builds — https://expo.dev
3. For local Android builds: **Android Studio** + SDK + JDK 17
4. **Fonts** — drop the `.ttf` files listed in [`assets/fonts/README.md`](assets/fonts/README.md) into `assets/fonts/`
5. **Firebase** (optional) — add `google-services.json` to the project root for push notifications/analytics. The app builds and runs without it.

## Setup

```bash
cd apps/mobile
npm install --legacy-peer-deps
cp .env.example .env   # then fill in API base URL, keys, etc.
```

## Run (development)

> ⚠️ This app uses native modules **not available in Expo Go** (keychain, MMKV,
> fast-image, jail-monkey, Firebase, biometrics, maps, Stripe). You must use a
> **development build**, not the Expo Go app.

```bash
# 1. Build & install a dev client on your device/emulator (one-time, cloud):
npx eas build --profile development --platform android

# 2. Start the Metro dev server and connect the dev client:
npx expo start --dev-client
```

## Build an APK (for sideloading / testing)

```bash
# Log in once:
npx eas login

# Configure the project (creates/links an EAS project ID):
npx eas build:configure

# Build an installable APK in Expo's cloud (~15–20 min):
npx eas build --profile preview --platform android
```

When it finishes, EAS prints a download URL for the `.apk`. Install it directly
on any Android device.

For a Play Store release bundle (`.aab`):

```bash
npx eas build --profile production --platform android
```

## Useful scripts

```bash
npm run type-check   # tsc --noEmit (strict)
npm run lint         # eslint
npm test             # jest
npx expo export --platform android   # validate the JS bundle locally
```

## Project structure

```
src/
  features/     auth, home, catalog, product, cart, orders, wishlist,
                ai-assistant, profile, live, notifications, search
  shared/       components, hooks, theme, utils, constants
  navigation/   RootNavigator, MainTabNavigator, feature stacks
  store/        store, rootReducer, api/ (RTK Query slices)
  services/     apiClient, securityService, keychainService, ...
  i18n/         en / fr / sw
assets/         fonts, images, animations
```

## Security notes

- JWT tokens stored in Keychain only (never MMKV/AsyncStorage)
- HMAC request signing + SSL pinning on API calls
- Jailbreak/root detection on launch
- Screenshot prevention on auth/payment screens
- All third-party APIs (OpenAI, Paystack) proxied through the backend

See [`docs/security.md`](../../docs/security.md) for the full policy.
