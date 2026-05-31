# Security Rules

## Token Management
- JWT access token (15min TTL) and refresh token (7d TTL)
- Store BOTH in react-native-keychain (Keychain Services / Android Keystore)
- NEVER use AsyncStorage, MMKV, or Redux for token storage
- On 401: auto-refresh via Axios interceptor, retry once, then force logout
- On logout: clear Keychain + Redux + MMKV, revoke refresh token on server

## SSL Pinning
```ts
// services/apiClient.ts — use react-native-ssl-pinning
fetch(url, {
  sslPinning: {
    certs: ['africa_mezziah_cert'] // SHA256 fingerprint in assets/certs/
  }
})
```
- Pin to backend SSL certificate
- Update pin on cert renewal (include backup pin for rotation)

## Jailbreak / Root Detection
```ts
// services/securityService.ts — run on App.tsx mount
import JailMonkey from 'jail-monkey'

export const checkDeviceSecurity = () => {
  if (JailMonkey.isJailBroken() || JailMonkey.isOnExternalStorage()) {
    // Show non-dismissible security warning screen
    // Do NOT crash — show friendly message and block navigation
  }
}
```

## Screenshot Prevention
```ts
// Apply to: PaymentScreen, CardEntryScreen, LoginScreen, OTPScreen
// Android: set FLAG_SECURE via react-native-screens or native module
// iOS: add secure text field overlay trick or use RCTSecureView
```

## Request Signing
Every API request must include:
```
X-Request-Signature: HMAC-SHA256(method + path + timestamp + body, CLIENT_SECRET)
X-Request-Timestamp: Unix timestamp (server rejects if >5min old)
X-App-Version: app version string
X-Platform: ios | android
```

## Biometric Auth
```ts
// react-native-biometrics
// On login success: offer to save credentials for biometric
// On subsequent opens: prompt biometric before showing content
// Fallback: PIN / password if biometric fails 3x
```

## MFA (TOTP)
- Setup: generate TOTP secret server-side, display QR + manual key
- Verification: 6-digit TOTP code valid 30s window (±1 window tolerance)
- Backup codes: 8 single-use codes, downloadable at setup
- Recovery: email verification flow if device lost

## Input Validation (all forms)
- Use Zod schemas — validate client-side before submission
- Sanitize all text inputs (strip HTML, script tags)
- Limit field lengths matching backend constraints
- Email: RFC5322 regex + Zod email()
- Phone: libphonenumber-js validation
- Password: min 8 chars, 1 upper, 1 number, 1 special

## Payment Security
- NEVER store raw card numbers, CVV, or expiry
- Use Paystack/Stripe tokenization — submit directly to their SDK, receive token
- 3DS 2.0 enforced for all card payments
- Display masked card number only (last 4 digits)
- Screenshot blocked on all payment screens

## Production Hardening
- No console.log in production (ESLint rule: no-console error)
- Sentry configured with data scrubbing (filter password, token, card fields)
- Hermes engine enabled (obfuscates JS)
- ProGuard rules for Android release build
- Disable USB debugging detection warning in-app
- Code splitting to make reverse engineering harder

## Privacy
- GDPR consent screen on first launch with granular toggles
- Analytics only after consent
- Data deletion: in-app request → backend deletes within 30 days
- Collect minimum viable data only
- Anonymize analytics events (no PII in event properties)

## Session Management
- List active sessions in SecuritySettings screen (device, location, last seen)
- One-tap revoke any session
- Automatic logout after 30min inactivity (background timer)
- New device login triggers email alert to user
