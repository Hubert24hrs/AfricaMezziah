import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import ReactNativeBiometrics from 'react-native-biometrics'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch, useAppSelector } from '@store/store'
import { setCredentials, setBiometricEnabled } from '@features/auth/authSlice'
import { useLoginMutation } from '@store/api/authApi'
import { saveTokens } from '@services/keychainService'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'

type Nav = NativeStackNavigationProp<AuthStackParamList>

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

const LoginScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation<Nav>()
  const dispatch = useAppDispatch()
  const biometricEnabled = useAppSelector(state => state.auth.biometricEnabled)
  const [login, { isLoading }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const result = await login(data).unwrap()
        await saveTokens(result.data.accessToken, result.data.refreshToken)
        dispatch(setCredentials({ user: result.data.user }))
      } catch {
        Alert.alert(t('common.error'), t('errors.networkError'))
      }
    },
    [login, dispatch, t],
  )

  const handleBiometric = useCallback(async () => {
    const rnBiometrics = new ReactNativeBiometrics()
    const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Sign in with biometrics' })
    if (success) {
      // Token already in keychain from last login
    }
  }, [])

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[typography.h2, { color: colors.primary, marginBottom: 8 }]}>{t('common.appName')}</Text>
      <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: 32 }]}>{t('auth.login')}</Text>

      <Input
        control={control}
        name="email"
        label={t('auth.email')}
        error={errors.email?.message}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        control={control}
        name="password"
        label={t('auth.password')}
        error={errors.password?.message}
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? '👁' : '🙈'}
        onRightIconPress={() => setShowPassword(p => !p)}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
        style={styles.forgotBtn}
      >
        <Text style={[typography.label, { color: colors.primary }]}>{t('auth.forgotPassword')}</Text>
      </TouchableOpacity>

      <Button
        label={t('auth.login')}
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        variant="primary"
        style={styles.loginBtn}
      />

      {biometricEnabled && (
        <Button
          label="Use Biometric"
          onPress={handleBiometric}
          variant="secondary"
          style={styles.biometricBtn}
        />
      )}

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[typography.caption, { color: colors.textMuted, marginHorizontal: 16 }]}>{t('common.or')}</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity
        style={[styles.socialBtn, { borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg }]}
        activeOpacity={0.75}
      >
        <Text style={[typography.body2, { color: colors.textPrimary }]}>{t('auth.continueWithGoogle')}</Text>
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <Text style={[typography.body2, { color: colors.textSecondary }]}>{t('auth.noAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
          <Text style={[typography.body2, { color: colors.primary }]}>{t('auth.signUpNow')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 80, paddingBottom: 40 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24, marginTop: 8 },
  loginBtn: { marginBottom: 16 },
  biometricBtn: { marginBottom: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1 },
  socialBtn: { height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
})

export default LoginScreen
