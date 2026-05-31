# Africa Mezziah — Android APK Build Tasks

## Phase 1: Prep
- [x] Install dependencies (`npm install --legacy-peer-deps`)
- [x] Add `react-native-svg-transformer` to devDependencies
- [x] Remove dead `@react-navigation/shared-element` + `react-native-shared-element`
- [x] Download real Google Fonts (Playfair Display, Poppins, Inter)
- [x] Generate app icon / splash / adaptive-icon images
- [x] Create `.env` from `.env.example`

## Phase 2: Fix Configs
- [x] Fix `app.config.ts` — conditional `googleServicesFile` + plugins
- [x] Fix `metro.config.js` — handle svg-transformer dependency
- [x] Add `.npmrc` file with `legacy-peer-deps=true` for EAS compatibility

## Phase 3: Verify
- [x] `npx tsc --noEmit` passes (0 errors!)
- [x] `npx expo export --platform android` succeeds

## Phase 4: Dependency Correction & Cloud Build
- [x] Downgrade `react-native-mmkv` to `^2.12.2` in `package.json`
- [x] Sync dependencies (`npm install`)
- [x] Run local sanity check (`npx tsc` and Metro export)
- [x] Add `SENTRY_DISABLE_AUTO_UPLOAD=true` to all build profiles in `eas.json`
- [x] Trigger new EAS Cloud Build (`eas build --platform android --profile staging`)
  - **Live Build URL:** https://expo.dev/accounts/hubert24hrs/projects/africa-mezziah/builds/700f2d85-dbb2-401c-8bd6-46365acc9b58
- [x] Deliver download URL/QR code of sideloadable APK
  - **Direct Download APK Link:** https://expo.dev/artifacts/eas/eQzxKfWvPhuC5cAU1gT7qG.apk
- [x] Install APK directly on connected physical device via ADB
  - **Device Connected:** `0678625163105479`
  - **ADB Install Status:** `Success`
