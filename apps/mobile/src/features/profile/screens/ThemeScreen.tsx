import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch, useAppSelector } from '@store/store'
import { setDarkMode } from '@store/appSlice'

const ThemeScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector(state => state.app.isDarkMode)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('profile.theme')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ padding: spacing.md, gap: spacing.md }}>
        {[
          { label: t('profile.darkMode'), icon: '🌙', value: true },
          { label: t('profile.lightMode'), icon: '☀️', value: false },
        ].map(opt => (
          <TouchableOpacity
            key={String(opt.value)}
            style={[
              styles.option,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                borderColor: isDarkMode === opt.value ? colors.primary : colors.border,
                borderWidth: 1.5,
                ...shadows.card,
              },
            ]}
            onPress={() => dispatch(setDarkMode(opt.value))}
          >
            <Text style={styles.icon}>{opt.icon}</Text>
            <Text style={[typography.body1, { color: colors.textPrimary, flex: 1 }]}>{opt.label}</Text>
            {isDarkMode === opt.value && <Text style={{ color: colors.primary, fontSize: 20 }}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  option: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  icon: { fontSize: 28 },
})

export default ThemeScreen
