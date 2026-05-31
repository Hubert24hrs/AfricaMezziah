import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { setHasGivenConsent } from '@store/appSlice'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'

type Nav = NativeStackNavigationProp<AuthStackParamList>

const ConsentScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation<Nav>()
  const dispatch = useAppDispatch()

  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  const handleAccept = useCallback(() => {
    dispatch(setHasGivenConsent(true))
    navigation.replace(ROUTES.LOGIN)
  }, [dispatch, navigation])

  const handleDecline = useCallback(() => {
    dispatch(setHasGivenConsent(true))
    navigation.replace(ROUTES.LOGIN)
  }, [dispatch, navigation])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, styles.title, { color: colors.textPrimary }]}>
          {t('auth.consent.title')}
        </Text>
        <Text style={[typography.body2, styles.subtitle, { color: colors.textSecondary }]}>
          {t('auth.consent.subtitle')}
        </Text>

        {[
          { key: 'functional', label: t('auth.consent.functional'), desc: t('auth.consent.functionalDesc'), value: true, disabled: true, onChange: () => {} },
          { key: 'analytics', label: t('auth.consent.analytics'), desc: t('auth.consent.analyticsDesc'), value: analytics, disabled: false, onChange: setAnalytics },
          { key: 'marketing', label: t('auth.consent.marketing'), desc: t('auth.consent.marketingDesc'), value: marketing, disabled: false, onChange: setMarketing },
        ].map(item => (
          <View
            key={item.key}
            style={[styles.consentRow, { backgroundColor: colors.surface, borderRadius: radius.lg, borderColor: colors.border, borderWidth: 1, ...shadows.card }]}
          >
            <View style={styles.consentText}>
              <Text style={[typography.label, { color: colors.textPrimary }]}>{item.label}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>{item.desc}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onChange}
              disabled={item.disabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={handleAccept}
          activeOpacity={0.75}
        >
          <Text style={[typography.button, { color: colors.textInverse }]}>{t('auth.consent.accept')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDecline} activeOpacity={0.75}>
          <Text style={[typography.body2, { color: colors.textMuted, textAlign: 'center' }]}>{t('auth.consent.decline')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingTop: 64, gap: 16 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 8 },
  consentRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  consentText: { flex: 1 },
  footer: { padding: 24, gap: 16, borderTopWidth: 1 },
  primaryBtn: { height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
})

export default ConsentScreen
