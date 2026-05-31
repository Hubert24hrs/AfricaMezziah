# Africa Mezziah – React Native Mobile App

## Project
Premium African fashion e-commerce app (women, men, children). Afrofuturism aesthetic.
Monorepo: `apps/mobile` (React Native), `apps/frontend` (Next.js), `apps/backend` (NestJS).
**We are building `apps/mobile` first.**

## Role
Act as a senior React Native engineer (20+ yrs), proficient UI/UX designer, and security-focused mobile architect. Write production-ready TypeScript. No shortcuts.

## Quick Reference
- Full spec: @docs/spec.md
- Architecture: @docs/architecture.md
- Design system: @docs/design.md
- Security rules: @docs/security.md
- API contracts: @docs/api.md
- Progress tracker: @docs/progress.md

---

## Stack (mobile only)
- **Framework**: React Native 0.74+ with Expo SDK 51
- **Language**: TypeScript (strict — no `any`)
- **Navigation**: React Navigation v6
- **State**: Redux Toolkit + RTK Query
- **Styling**: NativeWind + StyleSheet + theme.ts
- **Animations**: Reanimated 3 + Lottie
- **Lists**: FlashList (Shopify)
- **Secure storage**: react-native-keychain (tokens ONLY here)
- **Fast storage**: MMKV (all other persistence)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios with interceptors
- **3D**: expo-three + Three.js
- **Payments**: Paystack + Flutterwave + Stripe RN
- **AI chat**: OpenAI via backend proxy (NEVER call AI APIs directly from app)
- **Push**: Firebase Cloud Messaging
- **Crash**: Sentry
- **Analytics**: Firebase Analytics

---

## Dev Commands
```bash
# Install
cd apps/mobile && npm install

# Start
npx expo start

# iOS
npx expo run:ios

# Android
npx expo run:android

# Tests
npm test

# E2E
npx detox test

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## Absolute Rules (never break these)

### Security
- NEVER store JWT tokens in AsyncStorage — keychain ONLY
- NEVER call OpenAI, Paystack, or any third-party API directly from the app — always proxy via backend
- NEVER log sensitive data (tokens, passwords, card info) — use Sentry breadcrumbs instead
- ALWAYS apply SSL pinning (react-native-ssl-pinning) on all API calls
- ALWAYS run jailbreak/root detection on app launch (react-native-jail-monkey)
- ALWAYS block screenshots on payment and auth screens (FLAG_SECURE / iOS equivalent)

### Code
- TypeScript strict mode — zero `any` types
- No class components — hooks only
- Every component needs a TypeScript interface for props
- All strings must use i18n keys (react-i18next) — no hardcoded UI text
- Every API call via RTK Query — no raw fetch/axios in components
- Use FlashList for ALL scrollable product lists — never FlatList
- useCallback/useMemo on all functions/values passed as props
- Error boundaries at feature level minimum

### Git
- Branch: `feature/screen-name` or `fix/bug-description`
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, `security:`)
- Never commit `.env` files

---

## Folder Structure (`apps/mobile/src/`)
```
features/
  auth/          components, hooks, slice, service, types, screens
  home/
  catalog/
  product/
  cart/
  checkout/
  orders/
  wishlist/
  ai-assistant/
  profile/
  live/
  notifications/
shared/
  components/    Button, Card, Input, Badge, Skeleton, BottomSheet, Modal
  hooks/         useTheme, useAuth, useCart, useAnalytics, useHaptics
  theme/         index.ts (colors, typography, spacing, shadows, borderRadius)
  utils/         formatCurrency, formatDate, validators, securityUtils
  constants/     routes.ts, api.ts, config.ts
navigation/
  RootNavigator.tsx
  AuthNavigator.tsx
  MainTabNavigator.tsx
  feature stacks...
store/
  store.ts
  rootReducer.ts
  api/           RTK Query slices per feature
services/
  apiClient.ts   Axios instance with interceptors
  socketClient.ts
  analyticsService.ts
  securityService.ts  jailbreak, ssl, screenshot prevention
assets/
  fonts/
  images/
  animations/    Lottie JSON files
i18n/
  en.json, fr.json, sw.json
```

---

## Theme (always import from `@shared/theme`)
```ts
colors.primary       = '#C9A84C'   // Gold
colors.secondary     = '#1A1A2E'   // Deep navy
colors.accent        = '#E94560'   // Red accent
colors.background    = '#0F0F1A'   // Near black
colors.surface       = '#16213E'   // Card surface
colors.success       = '#00C896'
colors.error         = '#FF4757'
```
Dark theme is default. Light theme switchable in settings.

---

## Naming Conventions
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utils/hooks/services
- Components: PascalCase (`ProductCard`, `PriceTag`)
- Hooks: `use` prefix (`useCart`, `useWishlist`)
- Redux slices: `featureSlice.ts`
- RTK Query: `featureApi.ts`
- Types: `Feature.types.ts`
- Constants: UPPER_SNAKE_CASE
- Route names: defined in `constants/routes.ts` — never hardcode strings

---

## Component Template
```tsx
import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'

interface MyComponentProps {
  // define all props
}

/** JSDoc description */
const MyComponent: React.FC<MyComponentProps> = memo(({ }) => {
  const { colors } = useTheme()
  return <View style={styles.container} />
})

const styles = StyleSheet.create({
  container: {}
})

export default MyComponent
```

---

## Build Order
See @docs/progress.md for current status and next task.
General sequence: Setup → Theme → Navigation → Auth → Home → Catalog → Product Detail → Cart → Checkout → Orders → Profile → AI Assistant → Live Shopping → Security hardening → Testing
