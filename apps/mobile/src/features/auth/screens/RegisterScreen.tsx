import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { parsePhoneNumber } from 'libphonenumber-js'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { setCredentials } from '@features/auth/authSlice'
import { useRegisterMutation } from '@store/api/authApi'
import { saveTokens } from '@services/keychainService'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'

type Nav = NativeStackNavigationProp<AuthStackParamList>

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().refine(val => {
      try {
        return parsePhoneNumber(val).isValid()
      } catch {
        return false
      }
    }, 'errors.invalidPhone'),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, 'errors.passwordRequirements')
      .regex(/[0-9]/, 'errors.passwordRequirements')
      .regex(/[^A-Za-z0-9]/, 'errors.passwordRequirements'),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'errors.passwordMismatch',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const RegisterScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation<Nav>()
  const dispatch = useAppDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const password = watch('password', '')
  const strength = !password ? 0 : password.length < 8 ? 1 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? (/[^A-Za-z0-9]/.test(password) ? 4 : 3) : 2

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const result = await register({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }).unwrap()
        await saveTokens(result.data.accessToken, result.data.refreshToken)
        dispatch(setCredentials({ user: result.data.user }))
        navigation.navigate(ROUTES.BIOMETRIC_SETUP)
      } catch {
        Alert.alert(t('common.error'), t('errors.networkError'))
      }
    },
    [register, dispatch, navigation, t],
  )

  const strengthColors = ['transparent', colors.error, colors.warning, colors.info, colors.success]
  const strengthLabels = ['', t('auth.passwordWeak'), t('auth.passwordFair'), t('auth.passwordStrong'), t('auth.passwordVeryStrong')]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
      </TouchableOpacity>

      <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: 32 }]}>{t('auth.register')}</Text>

      <Input control={control} name="name" label={t('auth.firstName')} error={errors.name?.message} />
      <Input control={control} name="email" label={t('auth.email')} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" />
      <Input control={control} name="phone" label={t('auth.phone')} error={errors.phone?.message} keyboardType="phone-pad" />
      <Input
        control={control}
        name="password"
        label={t('auth.password')}
        error={errors.password?.message}
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? '👁' : '🙈'}
        onRightIconPress={() => setShowPassword(p => !p)}
      />

      {password.length > 0 && (
        <View style={styles.strength}>
          <View style={styles.strengthBars}>
            {[1, 2, 3, 4].map(i => (
              <View
                key={i}
                style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColors[strength] : colors.border }]}
              />
            ))}
          </View>
          <Text style={[typography.caption, { color: strengthColors[strength] }]}>{strengthLabels[strength]}</Text>
        </View>
      )}

      <Input control={control} name="confirmPassword" label={t('auth.confirmPassword')} error={errors.confirmPassword?.message} secureTextEntry />

      <Button label={t('auth.register')} onPress={handleSubmit(onSubmit)} loading={isLoading} variant="primary" style={styles.registerBtn} />

      <View style={styles.loginRow}>
        <Text style={[typography.body2, { color: colors.textSecondary }]}>{t('auth.hasAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
          <Text style={[typography.body2, { color: colors.primary }]}>{t('auth.loginNow')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  strength: { marginBottom: 16 },
  strengthBars: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  registerBtn: { marginTop: 8 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
})

export default RegisterScreen
