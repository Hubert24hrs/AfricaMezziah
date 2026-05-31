import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { setLanguage } from '@store/appSlice'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'

type Nav = NativeStackNavigationProp<AuthStackParamList>

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
]

const LanguageSelectionScreen: React.FC = memo(() => {
  const { t, i18n } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation<Nav>()
  const dispatch = useAppDispatch()

  const handleSelect = useCallback(
    async (code: string) => {
      await i18n.changeLanguage(code)
      dispatch(setLanguage(code))
      navigation.replace(ROUTES.CONSENT)
    },
    [i18n, dispatch, navigation],
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.h2, styles.title, { color: colors.textPrimary }]}>
        {t('onboarding.selectLanguage')}
      </Text>
      <Text style={[typography.body2, styles.subtitle, { color: colors.textSecondary }]}>
        {t('onboarding.languageSubtitle')}
      </Text>

      <FlatList
        data={LANGUAGES}
        keyExtractor={item => item.code}
        contentContainerStyle={{ gap: spacing.sm }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.surface, borderRadius: radius.lg, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => { void handleSelect(item.code) }}
            activeOpacity={0.75}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.itemText}>
              <Text style={[typography.body1, { color: colors.textPrimary }]}>{item.nativeName}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 64 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 32 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  flag: { fontSize: 32 },
  itemText: { flex: 1 },
})

export default LanguageSelectionScreen
