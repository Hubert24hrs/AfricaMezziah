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
import { useRegisterMutation } from '@store/api/authApi'
import { storeTokens } from '@services/keychainService'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { ROUTES } from '@shared/constants/routes'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Invalid phone number'),
    password: z
      .string()
      .min(8, 'Min 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[0-9]/, 'Must contain number')
      .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(v => v === true, 'You must accept the terms'),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

type PasswordStrength = 0 | 1 | 2 | 3 | 4

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score as PasswordStrength
}

const strengthLabels = ['', 'auth.weak', 'auth.fair', 'auth.strong', 'auth.veryStrong']
const strengthColors = ['transparent', '#FF4757', '#FFB830', '#C9A84C', '#00C896']

interface PasswordStrengthBarProps {
  password: string
}

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = memo(({ password }) => {
  const { t } = useTranslation()
  const strength = useMemo(() => getPasswordStrength(password), [password])

  if (!password) return null

  return (
    <View style={strengthStyles.container}>
      <View style={strengthStyles.bars}>
        {([1, 2, 3, 4] as const).map(level => (
          <View
            key={level}
            style={[
              strengthStyles.bar,
              {
                backgroundColor:
                  strength >= level ? strengthColors[strength] : 'rgba(255,255,255,0.12)',
              },
            ]}
          />
        ))}
      </View>
      {strength > 0 && (
        <Text style={[strengthStyles.label, { color: strengthColors[strength] }]}>
          {t(strengthLabels[strength])}
        </Text>
      )}
    </View>
  )
})

const strengthStyles = StyleSheet.create({
  container: { marginTop: 6, marginBottom: 4 },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 4 },
})

/** Registration screen with name, email, phone, password strength meter, and terms checkbox */
const RegisterScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [register, { isLoading }] = useRegisterMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  })

  const onSubmit = useCallback(
    async (data: RegisterForm) => {
      try {
        const res = await register({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }).unwrap()
        await storeTokens(res.accessToken, res.refreshToken)
        navigation.navigate(ROUTES.OTP_VERIFICATION, {
          contact: data.email,
          purpose: 'register',
        })
      } catch {
        setToast({ msg: t('errors.generic'), type: 'error' })
      }
    },
    [register, navigation, t],
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.fullName')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  autoCapitalize="words"
                  textContentType="name"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.email')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.phone')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    label={t('auth.password')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                    textContentType="newPassword"
                  />
                  <PasswordStrengthBar password={value} />
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth.confirmPassword')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                  textContentType="newPassword"
                />
              )}
            />

            <Controller
              control={control}
              name="termsAccepted"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => onChange(!value)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                    {value && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    {t('auth.agreeToThe')}{' '}
                    <Text style={styles.termsLink}>{t('auth.termsOfService')}</Text>
                    {' & '}
                    <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.termsAccepted && (
              <Text style={styles.errorText}>{errors.termsAccepted.message}</Text>
            )}
          </View>

          <Button
            title={t('auth.createAccount')}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitButton}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            style={styles.loginLink}
            activeOpacity={0.75}
          >
            <Text style={styles.loginText}>
              {t('auth.alreadyHaveAccount')}{' '}
              <Text style={styles.loginLinkText}>{t('auth.signIn')}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 24, paddingBottom: 40 },
    title: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 32,
      color: colors.textPrimary,
      marginTop: 32,
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 32,
    },
    form: { gap: 4 },
    termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, gap: 12 },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
    checkmark: { color: colors.textInverse, fontSize: 13, fontWeight: '700' },
    termsText: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 13, color: colors.textSecondary },
    termsLink: { color: colors.primary, fontFamily: 'Poppins-Medium' },
    errorText: { fontFamily: 'Inter-Regular', fontSize: 12, color: colors.error, marginTop: 4 },
    submitButton: { marginTop: 28 },
    loginLink: { alignItems: 'center', marginTop: 20 },
    loginText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary },
    loginLinkText: { color: colors.primary, fontFamily: 'Poppins-SemiBold' },
  })

export default RegisterScreen
