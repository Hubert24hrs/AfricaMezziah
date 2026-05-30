const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

config.resolver.alias = {
  '@shared': './src/shared',
  '@features': './src/features',
  '@navigation': './src/navigation',
  '@store': './src/store',
  '@services': './src/services',
  '@i18n': './src/i18n',
  '@assets': './assets',
}

module.exports = withNativeWind(config, { input: './global.css' })
