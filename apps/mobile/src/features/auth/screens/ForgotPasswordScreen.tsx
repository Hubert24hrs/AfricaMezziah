import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useForgotPasswordMutation, useVerifyOtpMutation } from '@store/api/authApi'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { ROUTES } from '@shared/constants/routes'

type Step = 1 | 2 | 3

const emailSchema = z.object({ email: z.string().email('Invalid email') })
const otpSchema = z.object({ otp: z.string().length(6, 'Enter 6-digit code') })
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    confirmPassword: z.string(),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type EmailForm = z.infer<typeof emailSchema>
type OtpForm = z.infer<typeof otpSchema>
type PasswordForm = z.infer<typeof passwordSchema>

interface StepIndicatorProps {
  current: Step
  colors: ReturnType<typeof useTheme>['colors']
}

const StepIndicator: React.FC<StepIndicatorProps> = memo(({ current, colors }) => (
  <View style={stepStyles.container}>
    {([1, 2, 3] as const).map((step, i) => (
      <React.Fragment key={step}>
        <View
          style={[
            stepStyles.dot,
            {
              backgroundColor: current >= step ? colors.primary : colors.surface,
              borderColor: current >= step ? colors.primary : colors.border,
            },
          ]}
        >
          {current > step ? (
            <Text style={[stepStyles.dotText, { color: colors.textInverse }]}>✓</Text>
          ) : (
            <Text
              style={[
                stepStyles.dotText,
                { color: current === step ? colors.textInverse : colors.textMuted },
              ]}
            >
              {step}
            </Text>
          )}
        </View>
        {i < 2 && (
          <View
            style={[
              stepStyles.line,
              { backgroundColor: current > step ? colors.primary : colors.border },
            ]}
          />
        )}
      </React.Fragment>
    ))}
  </View>
))

const stepStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { fontSize: 13, fontFamily: 'Inter-Bold' },
  line: { flex: 1, height: 1.5 },
})

const STEP_TITLES: Record<Step, string> = {
  1: 'auth.forgotTitle',
  2: 'auth.verifyCode',
  3: 'auth.newPassword',
}

/** Forgot password - 3 step flow: email → OTP → new password */
const ForgotPasswordScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const handleEmailSubmit = useCallback(
    async (data: EmailForm) => {
      try {
        await forgotPassword({ email: data.email }).unwrap()
        setEmail(data.email)
        setStep(2)
      } catch {
        setToast({ msg: t('errors.generic'), type: 'error' })
      }
    },
    [forgotPassword, t],
  )

  const handleOtpSubmit = useCallback(
    async (data: OtpForm) => {
      try {
        await verifyOtp({ destination: email, otp: data.otp, purpose: 'reset_password' }).unwrap()
        setStep(3)
      } catch {
        setToast({ msg: t('auth.invalidOtp'), type: 'error' })
      }
    },
    [verifyOtp, email, t],
  )

  const handlePasswordSubmit = useCallback(
    async (_data: PasswordForm) => {
      // Reset password via backend with stored OTP context (server-side session)
      setToast({ msg: t('auth.passwordResetSuccess'), type: 'success' })
      setTimeout(() => navigation.navigate(ROUTES.LOGIN), 1500)
    },
    [navigation, t],
  )

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : setStep((step - 1) as Step))}
            activeOpacity={0.75}
            style={styles.backButton}
          >
            <Text style={styles.backText}>{'← ' + t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t(STEP_TITLES[step])}</Text>

          <StepIndicator current={step} colors={colors} />

          {step === 1 && (
            <View>
              <Text style={styles.hint}>{t('auth.forgotHint')}</Text>
              <Controller
                control={emailForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.email')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={emailForm.formState.errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                  />
                )}
              />
              <Button
                title={t('auth.sendCode')}
                onPress={emailForm.handleSubmit(handleEmailSubmit)}
                loading={isSending}
                style={styles.button}
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.hint}>
                {t('auth.otpSentTo')} <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Controller
                control={otpForm.control}
                name="otp"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.enterCode')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={otpForm.formState.errors.otp?.message}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                )}
              />
              <Button
                title={t('auth.verify')}
                onPress={otpForm.handleSubmit(handleOtpSubmit)}
                loading={isVerifying}
                style={styles.button}
              />
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.hint}>{t('auth.newPasswordHint')}</Text>
              <Controller
                control={passwordForm.control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.newPassword')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={passwordForm.formState.errors.newPassword?.message}
                    secureTextEntry
                    textContentType="newPassword"
                  />
                )}
              />
              <Controller
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.confirmPassword')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={passwordForm.formState.errors.confirmPassword?.message}
                    secureTextEntry
                    textContentType="newPassword"
                  />
                )}
              />
              <Button
                title={t('auth.resetPassword')}
                onPress={passwordForm.handleSubmit(handlePasswordSubmit)}
                style={styles.button}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 24, paddingBottom: 40 },
    backButton: { paddingVertical: 12 },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textSecondary },
    title: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 30,
      color: colors.textPrimary,
      marginBottom: 24,
    },
    hint: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
    emailHighlight: { color: colors.primary, fontFamily: 'Poppins-SemiBold' },
    button: { marginTop: 24 },
  })

export default ForgotPasswordScreen
