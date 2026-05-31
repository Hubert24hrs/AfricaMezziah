import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { setLanguage } from '@store/appSlice'

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
]

const LanguageScreen: React.FC = memo(() => {
  const { t, i18n } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const handleSelect = useCallback(async (code: string) => {
    await i18n.changeLanguage(code)
    dispatch(setLanguage(code))
    navigation.goBack()
  }, [i18n, dispatch, navigation])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('profile.language')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={LANGUAGES}
        keyExtractor={item => item.code}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.surface, borderRadius: radius.lg, borderColor: i18n.language === item.code ? colors.primary : colors.border, borderWidth: 1.5 }]}
            onPress={() => { void handleSelect(item.code) }}
            activeOpacity={0.75}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.itemText}>
              <Text style={[typography.body1, { color: colors.textPrimary }]}>{item.nativeName}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>{item.name}</Text>
            </View>
            {i18n.language === item.code && <Text style={{ color: colors.primary }}>✓</Text>}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  flag: { fontSize: 32 },
  itemText: { flex: 1 },
})

export default LanguageScreen
