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
  detect: () => storage.getString('app_language') ?? 'en',
  init: () => {},
  cacheUserLanguage: (lang: string) => storage.set('app_language', lang),
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      sw: { translation: sw },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili' },
  { code: 'ha', label: 'Hausa', nativeLabel: 'Hausa' },
  { code: 'yo', label: 'Yoruba', nativeLabel: 'Yorùbá' },
  { code: 'ig', label: 'Igbo', nativeLabel: 'Igbo' },
]

export const changeLanguage = (lang: string) => {
  storage.set('app_language', lang)
  return i18n.changeLanguage(lang)
}

export const initI18n = () => i18n

export default i18n
