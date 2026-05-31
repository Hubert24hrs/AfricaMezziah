# Staging Android APK Build Resolution — Africa Mezziah

The staging Android APK build progressed past the MMKV compilation stage successfully, but errored during the Sentry Gradle step (`Run gradlew`). The logs indicate that the Sentry Gradle plugin tried to run `sentry-cli` to upload source maps, which failed because Sentry organization/project variables are not configured in this environment.

This plan details the required changes to bypass Sentry automatic sourcemap uploads during compilation and successfully deliver the sideloadable `.apk` file.

## User Review Required

> [!IMPORTANT]
> **Sentry Source Map Upload Failure**
> - In `app.config.ts`, the `@sentry/react-native/expo` plugin is added.
> - During release (staging) builds, the Sentry Gradle plugin automatically executes `sentry-cli` to upload source maps to the Sentry server.
> - Because you do not have a Sentry organization, project, or auth token set up in the EAS environment, `sentry-cli` crashes the build with `error: An organization ID or slug is required (provide with --org)`.
> - **Resolution:** Add the standard Sentry build-time variable `"SENTRY_DISABLE_AUTO_UPLOAD": "true"` to your build profile environments in `eas.json`. This instructs the Sentry Gradle plugin to skip sourcemap uploads during native compilation, allowing the build to complete successfully. Sentry runtime logging remains intact.

---

## Proposed Changes

### [mobile] (apps/mobile)

Surgical changes to bypass automatic Sentry CLI uploads during cloud compilation.

#### [MODIFY] [eas.json](file:///C:/Users/HP/AfricaMezziah/apps/mobile/eas.json)
- Add `"SENTRY_DISABLE_AUTO_UPLOAD": "true"` under the `"env"` block of `development`, `staging`, and `production` profiles.

---

## Execution Steps

### Step 1: Update eas.json
Configure the environment variables to bypass Sentry upload crash during builds.

### Step 2: Trigger EAS Cloud Build
Kicking off the staging cloud build command to produce the sideloadable `.apk`:
```bash
npx eas-cli build --platform android --profile staging --non-interactive
```

---

## Verification Plan

### Automated Verification
1. EAS build completes with **SUCCESS** status.

### Manual Verification
1. EAS provides the live APK download link and QR code in the console.
2. Install the staging `.apk` on an Android physical device or emulator.
3. Verify that app launches flawlessly to the onboarding carousel and security checks.
