import React, { memo, useCallback, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { MMKV } from 'react-native-mmkv'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@shared/hooks/useTheme'

const storage = new MMKV({ id: 'app-prefs' })

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

interface LanguageRowProps {
  item: Language
  isSelected: boolean
  onSelect: (code: string) => void
  colors: ReturnType<typeof useTheme>['colors']
}

const LanguageRow: React.FC<LanguageRowProps> = memo(({ item, isSelected, onSelect, colors }) => {
  const handlePress = useCallback(() => onSelect(item.code), [item.code, onSelect])
  return (
    <TouchableOpacity
      style={[
        styles.row,
        { borderBottomColor: colors.border },
        isSelected && styles.rowActive,
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.nativeName, { color: colors.textMuted }]}>{item.nativeName}</Text>
      </View>
      {isSelected && (
        <Text style={[styles.check, { color: colors.primary }]}>✓</Text>
      )}
    </TouchableOpacity>
  )
})

/** Language selection screen with all supported languages */
const LanguageScreen: React.FC = memo(() => {
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [selectedCode, setSelectedCode] = useState(i18n.language ?? 'en')

  const handleSelect = useCallback(
    (code: string) => {
      setSelectedCode(code)
      i18n.changeLanguage(code)
      storage.set('app_language', code)
    },
    [i18n],
  )

  const renderItem = useCallback(
    ({ item }: { item: Language }) => (
      <LanguageRow
        item={item}
        isSelected={selectedCode === item.code}
        onSelect={handleSelect}
        colors={colors}
      />
    ),
    [selectedCode, handleSelect, colors],
  )

  const sheetStyles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={sheetStyles.container}>
      <View style={sheetStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={sheetStyles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={sheetStyles.headerTitle}>{t('language.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlashList
        data={LANGUAGES}
        keyExtractor={item => item.code}
        renderItem={renderItem}
        estimatedItemSize={70}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    gap: 16,
  },
  rowActive: {},
  flag: { fontSize: 32 },
  info: { flex: 1 },
  name: { fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  nativeName: { fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 2 },
  check: { fontFamily: 'Inter-Bold', fontSize: 20 },
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary },
    headerTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
  })

export default LanguageScreen
