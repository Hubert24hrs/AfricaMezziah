module.exports = function (api) {
  api.cache(true)

  const isWeb = process.env.BABEL_ENV === 'web' || process.env.NODE_ENV === 'test'

  const webAlias = isWeb
    ? {
        'react-native-keychain': './src/shims/web/keychain',
        'jail-monkey': './src/shims/web/jailMonkey',
        'react-native-biometrics': './src/shims/web/biometrics',
        'react-native-mmkv': './src/shims/web/mmkv',
        'react-native-fast-image': './src/shims/web/fastImage',
        'react-native-ssl-pinning': './src/shims/web/sslPinning',
        'react-native-screenshot-prevent': './src/shims/web/screenshotPrevent',
        'react-native-share': './src/shims/web/share',
        'react-native-video': './src/shims/web/video',
        'react-native-maps': './src/shims/web/maps',
        'react-native-crypto-js': './src/shims/web/cryptoJs',
        '@react-native-firebase/app': './src/shims/web/firebase',
        '@react-native-firebase/analytics': './src/shims/web/firebaseAnalytics',
        '@react-native-firebase/messaging': './src/shims/web/firebaseMessaging',
        '@sentry/react-native': './src/shims/web/sentry',
        'lottie-react-native': './src/shims/web/lottie',
        'expo-three': './src/shims/web/expoThree',
      }
    : {}

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.web.js', '.web.ts', '.web.tsx', '.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@shared': './src/shared',
            '@features': './src/features',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@services': './src/services',
            '@constants': './src/constants',
            '@i18n': './src/i18n',
            '@assets': './src/assets',
            ...webAlias,
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
