import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useDeleteAccountMutation } from '@store/api/userApi'
import Toast from '@shared/components/Toast'

interface ConsentToggle {
  key: string
  titleKey: string
  descKey: string
}

const CONSENT_TOGGLES: ConsentToggle[] = [
  { key: 'analytics', titleKey: 'privacy.analytics', descKey: 'privacy.analyticsDesc' },
  { key: 'marketing', titleKey: 'privacy.marketing', descKey: 'privacy.marketingDesc' },
  { key: 'personalization', titleKey: 'privacy.personalization', descKey: 'privacy.personalizationDesc' },
]

/** Privacy settings — consent toggles, connected accounts, data/account management */
const PrivacySettingsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [deleteAccount] = useDeleteAccountMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)
  const [consents, setConsents] = useState<Record<string, boolean>>({
    analytics: true,
    marketing: false,
    personalization: true,
  })

  const handleConsentToggle = useCallback((key: string, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleDownloadData = useCallback(() => {
    setToast({ msg: t('privacy.dataRequestSent'), type: 'success' })
  }, [t])

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      t('privacy.deleteAccountTitle'),
      t('privacy.deleteAccountDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('privacy.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount().unwrap()
              setToast({ msg: t('privacy.accountDeleted'), type: 'success' })
            } catch {
              setToast({ msg: t('errors.generic'), type: 'error' })
            }
          },
        },
      ],
    )
  }, [deleteAccount, t])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacy.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Data Consent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.dataConsent')}</Text>
          {CONSENT_TOGGLES.map(toggle => (
            <View key={toggle.key} style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>{t(toggle.titleKey)}</Text>
                <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>{t(toggle.descKey)}</Text>
              </View>
              <Switch
                value={consents[toggle.key] ?? false}
                onValueChange={v => handleConsentToggle(toggle.key, v)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.textPrimary}
              />
            </View>
          ))}
        </View>

        {/* Connected Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.connectedAccounts')}</Text>
          {[
            { name: 'Google', icon: '🇬' },
            { name: 'Apple', icon: '🍎' },
          ].map(account => (
            <View key={account.name} style={styles.accountRow}>
              <Text style={styles.accountIcon}>{account.icon}</Text>
              <Text style={[styles.accountName, { color: colors.textPrimary }]}>{account.name}</Text>
              <TouchableOpacity
                style={[styles.connectBtn, { borderColor: colors.border }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.connectText, { color: colors.textSecondary }]}>
                  {t('privacy.connect')}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.dataManagement')}</Text>
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.surface }]}
            onPress={handleDownloadData}
            activeOpacity={0.75}
          >
            <Text style={styles.actionIcon}>📥</Text>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>{t('privacy.downloadData')}</Text>
              <Text style={[styles.actionDesc, { color: colors.textMuted }]}>{t('privacy.downloadDataDesc')}</Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: 'rgba(255,71,87,0.08)', borderColor: colors.error, borderWidth: 1 }]}
            onPress={handleDeleteAccount}
            activeOpacity={0.75}
          >
            <Text style={styles.actionIcon}>🗑</Text>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: colors.error }]}>{t('privacy.deleteAccount')}</Text>
              <Text style={[styles.actionDesc, { color: colors.textMuted }]}>{t('privacy.deleteAccountDesc')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
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
    scroll: { flex: 1 },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 16 },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 14,
    },
    toggleInfo: { flex: 1 },
    toggleTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
    toggleDesc: { fontFamily: 'Poppins-Regular', fontSize: 12, marginTop: 2, lineHeight: 18 },
    accountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    accountIcon: { fontSize: 24, width: 32, textAlign: 'center' },
    accountName: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 15 },
    connectBtn: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
    },
    connectText: { fontFamily: 'Poppins-Medium', fontSize: 13 },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      gap: 14,
    },
    actionIcon: { fontSize: 22, width: 28, textAlign: 'center' },
    actionInfo: { flex: 1 },
    actionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
    actionDesc: { fontFamily: 'Poppins-Regular', fontSize: 12, marginTop: 2, lineHeight: 18 },
    chevron: { fontSize: 22 },
  })

export default PrivacySettingsScreen
