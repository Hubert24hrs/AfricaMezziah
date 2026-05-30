import React, { memo, useCallback } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useEnableMfaMutation } from '@store/api/authApi'
import { useDispatch } from 'react-redux'
import { setMfaEnabled } from '../authSlice'
import Button from '@shared/components/Button'
import { ROUTES } from '@shared/constants/routes'

const MFASetupScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const [enableMfa, { data, isLoading }] = useEnableMfaMutation()

  const handleSetup = useCallback(async () => {
    try {
      await enableMfa().unwrap()
      dispatch(setMfaEnabled(true))
    } catch {
      // handled by toast
    }
  }, [enableMfa, dispatch])

  const handleSkip = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME_TAB }] })
  }, [navigation])

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.shield}>🔐</Text>
        <Text style={[styles.title, { color: colors.primary }]}>{t('mfa.title', 'Two-Factor Authentication')}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t('mfa.description', 'Add an extra layer of security to your account using an authenticator app like Google Authenticator.')}
        </Text>

        {data?.qrCodeUrl ? (
          <View style={[styles.qrContainer, { backgroundColor: '#fff' }]}>
            <Text style={styles.qrPlaceholder}>📱 QR Code</Text>
            <Text style={[styles.secretLabel, { color: colors.textMuted }]}>{t('mfa.manualKey', 'Manual key:')}</Text>
            <Text style={[styles.secret, { color: colors.textPrimary }]}>{data.secret}</Text>
          </View>
        ) : null}

        <Button
          label={data ? t('mfa.verify', 'Verify & Enable') : t('mfa.setup', 'Set Up 2FA')}
          onPress={handleSetup}
          loading={isLoading}
          fullWidth
          style={styles.btn}
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.75}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>{t('common.skipForNow', 'Skip for now')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 24, alignItems: 'center' },
  shield: { fontSize: 64, marginTop: 40, marginBottom: 24 },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, textAlign: 'center', marginBottom: 16 },
  description: { fontFamily: 'Poppins-Regular', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  qrContainer: { borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 32, width: '100%' },
  qrPlaceholder: { fontSize: 80, marginBottom: 16 },
  secretLabel: { fontFamily: 'Poppins-Regular', fontSize: 12, marginBottom: 4 },
  secret: { fontFamily: 'Inter-Bold', fontSize: 14, letterSpacing: 2 },
  btn: { marginBottom: 16 },
  skipBtn: { paddingVertical: 12 },
  skipText: { fontFamily: 'Poppins-Regular', fontSize: 14 },
})

export default MFASetupScreen
