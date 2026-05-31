import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { setBiometricEnabled } from '@features/auth/authSlice'
import type { AuthStackParamList } from '@navigation/AuthNavigator'
import Button from '@shared/components/Button'

type Nav = NativeStackNavigationProp<AuthStackParamList>

const BiometricSetupScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography } = useTheme()
  const navigation = useNavigation<Nav>()
  const dispatch = useAppDispatch()

  const handleEnable = useCallback(async () => {
    const rnBiometrics = new ReactNativeBiometrics()
    const { available, biometryType } = await rnBiometrics.isSensorAvailable()

    if (!available) {
      dispatch(setBiometricEnabled(false))
      navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] })
      return
    }

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: `Enable ${biometryType ?? BiometryTypes.Biometrics} login`,
    })

    if (success) {
      dispatch(setBiometricEnabled(true))
    }
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] })
  }, [dispatch, navigation])

  const handleSkip = useCallback(() => {
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] })
  }, [navigation])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.icon}>🔐</Text>
      <Text style={[typography.h3, { color: colors.textPrimary, textAlign: 'center', marginBottom: 16 }]}>
        {t('auth.biometricTitle')}
      </Text>
      <Text style={[typography.body1, { color: colors.textSecondary, textAlign: 'center', marginBottom: 48 }]}>
        {t('auth.biometricSubtitle')}
      </Text>

      <Button label={t('auth.enableBiometric')} onPress={handleEnable} variant="primary" style={styles.btn} />

      <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
        <Text style={[typography.body2, { color: colors.textMuted }]}>{t('auth.skipForNow')}</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 80, marginBottom: 32 },
  btn: { width: '100%', marginBottom: 16 },
  skipBtn: { padding: 16 },
})

export default BiometricSetupScreen
