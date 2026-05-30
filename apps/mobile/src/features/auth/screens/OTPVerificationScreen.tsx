import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useVerifyOtpMutation } from '@store/api/authApi'
import { storeTokens } from '@services/keychainService'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { ROUTES } from '@shared/constants/routes'

type OTPRouteParams = {
  OTPVerification: { contact: string; purpose: string }
}

const OTP_LENGTH = 6
const RESEND_SECONDS = 60

/** OTP verification screen with 6 individual digit boxes and resend countdown */
const OTPVerificationScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<OTPRouteParams, 'OTPVerification'>>()
  const { contact, purpose } = route.params

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)
  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null))

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const sanitized = value.replace(/[^0-9]/g, '').slice(-1)
      const next = [...digits]
      next[index] = sanitized
      setDigits(next)

      if (sanitized && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      if (next.every(d => d !== '') && sanitized) {
        handleAutoSubmit(next)
      }
    },
    [digits],
  )

  const handleKeyPress = useCallback(
    (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    },
    [digits],
  )

  const handleAutoSubmit = useCallback(
    async (filledDigits: string[]) => {
      const otp = filledDigits.join('')
      try {
        const res = await verifyOtp({ destination: contact, otp, purpose }).unwrap()
        if (res?.accessToken) {
          await storeTokens(res.accessToken, res.refreshToken)
        }
        if (purpose === 'register') {
          navigation.navigate(ROUTES.BIOMETRIC_SETUP)
        } else {
          navigation.goBack()
        }
      } catch {
        setToast({ msg: t('auth.invalidOtp'), type: 'error' })
        setDigits(Array(OTP_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      }
    },
    [verifyOtp, contact, purpose, navigation, t],
  )

  const handleResend = useCallback(() => {
    setCountdown(RESEND_SECONDS)
    setDigits(Array(OTP_LENGTH).fill(''))
    inputRefs.current[0]?.focus()
    // Resend OTP via API (call forgotPassword or dedicated resend endpoint)
  }, [])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.75}
      >
        <Text style={styles.backText}>{'← ' + t('common.back')}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.verifyCode')}</Text>
        <Text style={styles.subtitle}>
          {t('auth.otpSentTo')} <Text style={styles.contact}>{contact}</Text>
        </Text>

        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputRefs.current[index] = ref
              }}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
              ]}
              value={digit}
              onChangeText={v => handleDigitChange(index, v)}
              onKeyPress={e => handleKeyPress(index, e)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
              caretHidden
            />
          ))}
        </View>

        <Button
          title={t('auth.verify')}
          onPress={() => handleAutoSubmit(digits)}
          loading={isLoading}
          disabled={digits.some(d => !d)}
          style={styles.verifyButton}
        />

        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={styles.resendCountdown}>
              {t('auth.resendIn')} {countdown}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.75}>
              <Text style={styles.resendLink}>{t('auth.resendCode')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    backButton: { paddingHorizontal: 24, paddingTop: 12 },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textSecondary },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
    title: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 32,
      color: colors.textPrimary,
      marginBottom: 12,
    },
    subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary, marginBottom: 40 },
    contact: { color: colors.primary, fontFamily: 'Poppins-SemiBold' },
    otpRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 40 },
    otpBox: {
      width: 48,
      height: 56,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      textAlign: 'center',
      fontSize: 22,
      fontFamily: 'Inter-Bold',
      color: colors.textPrimary,
    },
    otpBoxFilled: { borderColor: colors.primary },
    verifyButton: {},
    resendRow: { alignItems: 'center', marginTop: 24 },
    resendCountdown: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textMuted },
    resendLink: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: colors.primary },
  })

export default OTPVerificationScreen
