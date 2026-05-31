import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { MMKV } from 'react-native-mmkv'

import en from './en.json'
import fr from './fr.json'
import sw from './sw.json'

const storage = new MMKV({ id: 'i18n-storage' })

const languageDetector = {
  type: 'languageDetector' as const,
  async: false,
  init: () => {},
  detect: (): string => {
    const saved = storage.getString('user-language')
    return saved ?? 'en'
  },
  cacheUserLanguage: (language: string) => {
    storage.set('user-language', language)
  },
}

void i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      sw: { translation: sw },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

export default i18n
export const supportedLanguages = ['en', 'fr', 'sw', 'ha', 'yo', 'ig'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]
