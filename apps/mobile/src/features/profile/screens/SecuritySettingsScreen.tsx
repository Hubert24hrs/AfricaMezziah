import React, { memo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetSessionsQuery, useRevokeSessionMutation } from '@store/api/authApi'
import { useAppDispatch, useAppSelector } from '@store/store'
import { setBiometricEnabled } from '@features/auth/authSlice'

const SecuritySettingsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const biometricEnabled = useAppSelector(state => state.auth.biometricEnabled)
  const { data: sessions } = useGetSessionsQuery()
  const [revokeSession] = useRevokeSessionMutation()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('settings.security.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <View style={styles.settingRow}>
            <View>
              <Text style={[typography.label, { color: colors.textPrimary }]}>{t('settings.security.biometric')}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>Face ID / Fingerprint login</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={val => { dispatch(setBiometricEnabled(val)) }}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 16 }]}>{t('settings.security.activeSessions')}</Text>
          {(sessions ?? []).map(session => (
            <View key={session.id} style={[styles.sessionRow, { borderBottomColor: colors.border }]}>
              <View style={styles.sessionInfo}>
                <Text style={[typography.label, { color: colors.textPrimary }]}>{session.device}</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>{session.location} · {session.lastSeen}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Revoke Session', 'End this session?', [
                    { text: t('common.cancel'), style: 'cancel' },
                    { text: 'Revoke', style: 'destructive', onPress: () => { void revokeSession(session.id) } },
                  ])
                }}
              >
                <Text style={[typography.caption, { color: colors.error }]}>{t('settings.security.revokeSession')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  section: { padding: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  sessionInfo: { flex: 1, gap: 4 },
})

export default SecuritySettingsScreen
