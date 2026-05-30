import React, { memo, useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { MMKV } from 'react-native-mmkv'
import { useTheme } from '@shared/hooks/useTheme'

const storage = new MMKV({ id: 'app-prefs' })

type ThemeMode = 'dark' | 'light' | 'auto'

const THEME_OPTIONS: { key: ThemeMode; labelKey: string; icon: string; previewBg: string; previewText: string }[] = [
  { key: 'dark', labelKey: 'theme.dark', icon: '🌙', previewBg: '#0F0F1A', previewText: '#FFFFFF' },
  { key: 'light', labelKey: 'theme.light', icon: '☀️', previewBg: '#FAFAFA', previewText: '#0F0F1A' },
  { key: 'auto', labelKey: 'theme.auto', icon: '⚙️', previewBg: '#16213E', previewText: '#B0B0C3' },
]

/** Theme selector — Dark / Light / Auto with preview cards */
const ThemeScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const currentTheme: ThemeMode = useSelector(
    (s: { theme?: { mode: ThemeMode } }) => s.theme?.mode ?? 'dark',
  )

  const handleSelectTheme = useCallback(
    (mode: ThemeMode) => {
      storage.set('theme_mode', mode)
      dispatch({ type: 'theme/setTheme', payload: mode })
    },
    [dispatch],
  )

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('theme.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>{t('theme.subtitle')}</Text>

        <View style={styles.optionsList}>
          {THEME_OPTIONS.map(option => {
            const isActive = currentTheme === option.key
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionCard,
                  isActive && styles.optionCardActive,
                ]}
                onPress={() => handleSelectTheme(option.key)}
                activeOpacity={0.75}
              >
                {/* Preview */}
                <View style={[styles.preview, { backgroundColor: option.previewBg }]}>
                  <View style={[styles.previewBar, { backgroundColor: option.previewText + '30' }]} />
                  <View style={[styles.previewContent]}>
                    <View style={[styles.previewBlock, { backgroundColor: option.previewText + '50', width: '60%' }]} />
                    <View style={[styles.previewBlock, { backgroundColor: option.previewText + '30', width: '40%' }]} />
                  </View>
                  <View style={[styles.previewButton, { backgroundColor: '#C9A84C' }]} />
                </View>

                {/* Label */}
                <View style={styles.optionLabel}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={[styles.optionText, { color: isActive ? colors.primary : colors.textPrimary }]}>
                    {t(option.labelKey)}
                  </Text>
                  {isActive && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
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
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
    subtitle: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 28,
    },
    optionsList: { flexDirection: 'row', gap: 14 },
    optionCard: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    optionCardActive: { borderColor: colors.primary },
    preview: {
      height: 120,
      padding: 10,
      justifyContent: 'space-between',
    },
    previewBar: { height: 8, borderRadius: 4, width: '100%' },
    previewContent: { gap: 6 },
    previewBlock: { height: 6, borderRadius: 3 },
    previewButton: { height: 12, borderRadius: 6, width: '50%', alignSelf: 'center' },
    optionLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 8,
    },
    optionIcon: { fontSize: 18 },
    optionText: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 14 },
    checkmark: { fontFamily: 'Inter-Bold', fontSize: 16 },
  })

export default ThemeScreen
