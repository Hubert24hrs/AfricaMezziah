module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@shared': './src/shared',
            '@features': './src/features',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@services': './src/services',
            '@i18n': './src/i18n',
            '@assets': './assets',
          },
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        },
      ],
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  }
}
