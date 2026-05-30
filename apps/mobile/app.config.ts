import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Africa Mezziah',
  slug: 'africa-mezziah',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#0F0F1A',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.africamezziah.app',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'Used for visual product search',
      NSPhotoLibraryUsageDescription: 'Used to upload profile and review photos',
      NSFaceIDUsageDescription: 'Used for biometric authentication',
      NSMicrophoneUsageDescription: 'Used for AI voice assistant',
    },
  },
  android: {
    package: 'com.africamezziah.app',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#0F0F1A',
    },
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'RECORD_AUDIO',
      'USE_BIOMETRIC',
      'USE_FINGERPRINT',
    ],
    googleServicesFile: './google-services.json',
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-font',
    'expo-splash-screen',
    'expo-camera',
    'expo-image-picker',
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#C9A84C',
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'africa-mezziah',
        organization: 'africa-mezziah',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
})
