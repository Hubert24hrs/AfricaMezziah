# EAS Cloud Build Details — Africa Mezziah

This document contains permanent references to your successfully compiled Expo Application Services (EAS) cloud builds and configuration profiles.

## 🚀 Active Sideloadable Build (Latest)
* **Build ID:** `b3938df5-a604-418f-866e-86a966b5f314`
* **Platform:** Android
* **Profile:** `staging` (produces standalone sideloadable `.apk`)
* **Live EAS Dashboard URL:** [View Compilation & Logs](https://expo.dev/accounts/hubert24hrs/projects/africa-mezziah/builds/b3938df5-a604-418f-866e-86a966b5f314)
* **Direct APK Download Link:** 👉 **[Download Standalone APK](https://expo.dev/artifacts/eas/ob9dP7hMtofDY66hHabwqL.apk)** 👈


---

## 🛠️ Build Environment Configuration
1. **Dynamic Configuration (`app.config.ts`)**:
   - Integrated the real, verified Expo project ID: `8a433821-f875-425a-b48f-19c6febf6d16`.
   - Google Services config is made dynamic and conditional on file presence, allowing compilation to succeed cleanly without Firebase JSON files.
2. **Auto-bypass Sentry Uploads (`eas.json`)**:
   - Injected `"SENTRY_DISABLE_AUTO_UPLOAD": "true"` in the build environment profiles.
   - Prevents the native compilation from failing on missing Sentry slugs/tokens, while keeping Sentry active at runtime.
3. **Legacy Dependency Resolver (`.npmrc`)**:
   - Declared `legacy-peer-deps=true` to force both EAS cloud runners and local npm installers to build smoothly without peer conflicts.

---

## 📱 Sideload Installation Instructions
1. Download the `.apk` file using the download link above directly on your physical Android device.
2. Open the downloaded file to prompt the package installer. If required, allow installations from "unknown sources" in your browser or explorer settings.
3. Launch and test the premium Afrofuturistic onboarding carousel, fonts, and custom transitions!

---

## 🔐 Keystore Credentials (Expo Cloud)
Expo has automatically generated and signed your staging APK using cloud-stored credentials:
* **Keystore ID:** `Build Credentials BJ1oHlx5mW`
* **Keystore Owner:** `hubert24hrs` (Expo Account)
These signing details are stored securely in Expo's secure cloud servers, meaning future rebuilds will automatically use the same signing key for update compatibility.
