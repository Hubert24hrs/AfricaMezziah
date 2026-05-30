import React, { memo, useCallback, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useLoginMutation } from '@store/api/authApi'
import { storeTokens } from '@services/keychainService'
import { loginSchema } from '@shared/utils/validators'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { ROUTES } from '@shared/constants/routes'
import { z } from 'zod'

type LoginForm = z.infer<typeof loginSchema>

const LoginScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [login, { isLoading }] = useLoginMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = useCallback(async (data: LoginForm) => {
    try {
      const res = await login(data).unwrap()
      await storeTokens(res.accessToken, res.refreshToken)
    } catch {
      setToast({ msg: t('errors.generic'), type: 'error' })
    }
  }, [login, t])

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.primary }]}>Africa Mezziah</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('auth.welcomeBack')}</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input label={t('auth.email')} value={value} onChangeText={onChange}
                error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input label={t('auth.password')} value={value} onChangeText={onChange}
                error={errors.password?.message} secureEntry />
            )}
          />

          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)} style={styles.forgot}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <Button label={t('auth.login')} onPress={handleSubmit(onSubmit)} loading={isLoading} fullWidth />

          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>{t('auth.noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>{t('auth.register')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {toast && <Toast message={toast.msg} type={toast.type} visible onHide={() => setToast(null)} />}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 32, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 16, textAlign: 'center', marginBottom: 40 },
  forgot: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },
  forgotText: { fontFamily: 'Poppins-Regular', fontSize: 14 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { fontFamily: 'Poppins-Regular', fontSize: 14 },
  registerLink: { fontFamily: 'Poppins-SemiBold', fontSize: 14 },
})

export default LoginScreen
