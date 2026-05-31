import React, { memo, useState, useRef, useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { setCredentials } from '@features/auth/authSlice'
import { useVerifyOTPMutation } from '@store/api/authApi'
import { saveTokens } from '@services/keychainService'
import { enableScreenshotPrevention, disableScreenshotPrevention } from '@services/securityService'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'
import Button from '@shared/components/Button'

type Nav = NativeStackNavigationProp<AuthStackParamList>
type RouteT = RouteProp<AuthStackParamList, typeof ROUTES.OTP_VERIFICATION>

const OTPVerificationScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation<Nav>()
  const route = useRoute<RouteT>()
  const dispatch = useAppDispatch()
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<Array<TextInput | null>>([])

  useEffect(() => {
    void enableScreenshotPrevention()
    return () => { void disableScreenshotPrevention() }
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = useCallback((text: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = text.slice(-1)
    setOtp(newOtp)

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      void handleVerify(newOtp.join(''))
    }
  }, [otp])

  const handleVerify = useCallback(
    async (code: string) => {
      try {
        const result = await verifyOTP({
          destination: route.params.destination,
          otp: code,
          purpose: route.params.purpose,
        }).unwrap()
        await saveTokens(result.data.accessToken, result.data.refreshToken)
        dispatch(setCredentials({ user: result.data.user }))
        navigation.replace(ROUTES.BIOMETRIC_SETUP)
      } catch {
        Alert.alert(t('common.error'), t('errors.networkError'))
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    },
    [verifyOTP, route.params, dispatch, navigation, t],
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
      </TouchableOpacity>

      <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: 8 }]}>{t('auth.otpTitle')}</Text>
      <Text style={[typography.body2, { color: colors.textSecondary, marginBottom: 40 }]}>
        {t('auth.otpSubtitle', { destination: route.params.destination })}
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={ref => { inputRefs.current[i] = ref }}
            style={[
              styles.otpInput,
              {
                backgroundColor: colors.surface,
                borderColor: digit ? colors.primary : colors.border,
                color: colors.textPrimary,
                borderRadius: radius.md,
                fontSize: 24,
              },
            ]}
            value={digit}
            onChangeText={text => handleChange(text, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>

      <Button
        label={t('common.confirm')}
        onPress={() => { void handleVerify(otp.join('')) }}
        loading={isLoading}
        variant="primary"
        disabled={otp.some(d => !d)}
        style={styles.confirmBtn}
      />

      <TouchableOpacity
        disabled={countdown > 0}
        onPress={() => setCountdown(60)}
        style={styles.resendBtn}
      >
        <Text style={[typography.body2, { color: countdown > 0 ? colors.textMuted : colors.primary }]}>
          {countdown > 0 ? t('auth.otpResendIn', { seconds: countdown }) : t('auth.otpResend')}
        </Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 24 },
  otpRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  otpInput: { flex: 1, height: 60, borderWidth: 2, fontWeight: 'bold' },
  confirmBtn: { marginBottom: 16 },
  resendBtn: { alignItems: 'center' },
})

export default OTPVerificationScreen
