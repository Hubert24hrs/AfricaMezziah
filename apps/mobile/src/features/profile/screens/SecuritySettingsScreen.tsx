import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactNativeBiometrics from 'react-native-biometrics'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetSessionsQuery, useRevokeSessionMutation } from '@store/api/authApi'
import { setBiometricEnabled } from '@features/auth/authSlice'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const rnBiometrics = new ReactNativeBiometrics()

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
    confirmPassword: z.string(),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordForm = z.infer<typeof passwordSchema>

/** Security settings — change password, biometric toggle, MFA, active sessions */
const SecuritySettingsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const biometricEnabled: boolean = useSelector((s: { auth: { biometricEnabled: boolean } }) => s.auth.biometricEnabled)

  const { data: sessions, isLoading: loadingSessions } = useGetSessionsQuery()
  const [revokeSession] = useRevokeSessionMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const handlePasswordChange = useCallback(
    async (_data: PasswordForm) => {
      // Typically: call changePassword endpoint
      setToast({ msg: t('security.passwordChanged'), type: 'success' })
      reset()
    },
    [reset, t],
  )

  const handleBiometricToggle = useCallback(
    async (value: boolean) => {
      if (value) {
        try {
          const { success } = await rnBiometrics.simplePrompt({
            promptMessage: t('auth.biometricPromptMessage'),
          })
          if (success) dispatch(setBiometricEnabled(true))
        } catch {
          setToast({ msg: t('errors.generic'), type: 'error' })
        }
      } else {
        dispatch(setBiometricEnabled(false))
      }
    },
    [dispatch, t],
  )

  const handleRevokeSession = useCallback(
    (id: string) => {
      Alert.alert(t('security.revokeSession'), t('security.revokeSessionDesc'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('security.revoke'),
          style: 'destructive',
          onPress: async () => {
            try {
              await revokeSession(id).unwrap()
              setToast({ msg: t('security.sessionRevoked'), type: 'success' })
            } catch {
              setToast({ msg: t('errors.generic'), type: 'error' })
            }
          },
        },
      ])
    },
    [revokeSession, t],
  )

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('security.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('security.changePassword')}</Text>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('security.currentPassword')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.currentPassword?.message}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('security.newPassword')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.newPassword?.message}
                secureTextEntry
              />
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
              />
            )}
          />
          <Button
            title={t('security.updatePassword')}
            onPress={handleSubmit(handlePasswordChange)}
            style={styles.updateBtn}
          />
        </View>

        {/* Biometric */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>{t('auth.biometrics')}</Text>
              <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>{t('security.biometricDesc')}</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>

        {/* MFA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('security.twoFactor')}</Text>
          <Text style={[styles.mfaDesc, { color: colors.textSecondary }]}>{t('security.mfaDesc')}</Text>
          <Button
            title={t('security.setupMFA')}
            onPress={() => {}}
            variant="secondary"
            style={styles.mfaBtn}
          />
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('security.activeSessions')}</Text>
          {loadingSessions ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            sessions?.map(session => (
              <View key={session.id} style={[styles.sessionCard, { backgroundColor: colors.surface }]}>
                <View style={styles.sessionInfo}>
                  <Text style={[styles.sessionDevice, { color: colors.textPrimary }]}>{session.device}</Text>
                  <Text style={[styles.sessionMeta, { color: colors.textMuted }]}>{session.location}</Text>
                  <Text style={[styles.sessionMeta, { color: colors.textMuted }]}>
                    {t('security.lastSeen')} {new Date(session.lastSeen).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRevokeSession(session.id)}
                  style={[styles.revokeBtn, { borderColor: colors.error }]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.revokeText, { color: colors.error }]}>{t('security.revoke')}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary },
    headerTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    scroll: { flex: 1 },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 16 },
    updateBtn: { marginTop: 12 },
    toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
    toggleInfo: { flex: 1 },
    toggleTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary },
    toggleDesc: { fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 2 },
    mfaDesc: { fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 20, marginBottom: 16 },
    mfaBtn: {},
    sessionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 12,
      marginBottom: 10,
      gap: 12,
    },
    sessionInfo: { flex: 1 },
    sessionDevice: { fontFamily: 'Poppins-SemiBold', fontSize: 14 },
    sessionMeta: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
    revokeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    revokeText: { fontFamily: 'Poppins-Medium', fontSize: 12 },
  })

export default SecuritySettingsScreen
