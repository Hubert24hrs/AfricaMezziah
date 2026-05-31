import { ExpoConfig, ConfigContext } from 'expo/config'
import * as fs from 'fs'
import * as path from 'path'

const hasGoogleServices = fs.existsSync(
  path.resolve(__dirname, './google-services.json')
)

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins: ExpoConfig['plugins'] = [
    'expo-font',
    'expo-secure-store',
    'expo-camera',
    'expo-image-picker',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0F0F1A',
        image: './src/assets/images/splash.png',
        imageWidth: 200,
      },
    ],
  ]

  // Only include Firebase plugin when google-services.json is present
  if (hasGoogleServices) {
    plugins.push('@react-native-firebase/app')
  }

  // Sentry plugin — safe to include even without DSN configured
  plugins.push('@sentry/react-native/expo')

  return {
    ...config,
    name: 'Africa Mezziah',
    slug: 'africa-mezziah',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './src/assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0F0F1A',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.africamezziah.app',
      buildNumber: '1',
      infoPlist: {
        NSCameraUsageDescription: 'Used for visual search and profile photo',
        NSPhotoLibraryUsageDescription: 'Used for profile photo and visual search',
        NSFaceIDUsageDescription: 'Used for biometric authentication',
        NSMicrophoneUsageDescription: 'Used for voice search',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#0F0F1A',
      },
      package: 'com.africamezziah.app',
      versionCode: 1,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.USE_BIOMETRIC',
        'android.permission.USE_FINGERPRINT',
        'android.permission.RECORD_AUDIO',
      ],
      ...(hasGoogleServices && {
        googleServicesFile: './google-services.json',
      }),
    },
    web: {
      favicon: './src/assets/images/favicon.png',
    },
    plugins,
    extra: {
      eas: { projectId: '8a433821-f875-425a-b48f-19c6febf6d16' },
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/8a433821-f875-425a-b48f-19c6febf6d16',
    },
    runtimeVersion: { policy: 'appVersion' },
  }
}
