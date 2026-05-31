import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useForgotPasswordMutation } from '@store/api/authApi'
import { ROUTES } from '@constants/routes'
import type { AuthStackParamList } from '@navigation/AuthNavigator'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'

type Nav = NativeStackNavigationProp<AuthStackParamList>
const schema = z.object({ email: z.string().email() })
type FormData = z.infer<typeof schema>

const ForgotPasswordScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography } = useTheme()
  const navigation = useNavigation<Nav>()
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await forgotPassword(data).unwrap()
        navigation.navigate(ROUTES.OTP_VERIFICATION, { destination: data.email, purpose: 'reset' })
      } catch {
        Alert.alert(t('common.error'), t('errors.networkError'))
      }
    },
    [forgotPassword, navigation, t],
  )

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
      </TouchableOpacity>

      <Text style={[typography.h3, { color: colors.textPrimary, marginBottom: 8 }]}>{t('auth.resetPassword')}</Text>
      <Text style={[typography.body2, { color: colors.textSecondary, marginBottom: 32 }]}>
        Enter your email to receive a reset code.
      </Text>

      <Input control={control} name="email" label={t('auth.email')} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" />

      <Button label={t('common.next')} onPress={handleSubmit(onSubmit)} loading={isLoading} variant="primary" style={styles.btn} />
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 24 },
  btn: { marginTop: 8 },
})

export default ForgotPasswordScreen
