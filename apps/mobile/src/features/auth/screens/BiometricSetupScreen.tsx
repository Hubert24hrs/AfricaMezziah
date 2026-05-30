import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { useTheme } from '@shared/hooks/useTheme'
import { setBiometricEnabled } from '@features/auth/authSlice'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { ROUTES } from '@shared/constants/routes'

const rnBiometrics = new ReactNativeBiometrics()

/** Biometric setup screen — prompts user to enable Face ID / fingerprint */
const BiometricSetupScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()

  const [biometryType, setBiometryType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  useEffect(() => {
    rnBiometrics.isSensorAvailable().then(({ biometryType: type, available }) => {
      if (available && type) {
        setBiometryType(type)
      }
    })
  }, [])

  const biometricLabel = useMemo(() => {
    if (biometryType === BiometryTypes.FaceID) return t('auth.faceId')
    if (biometryType === BiometryTypes.TouchID) return t('auth.touchId')
    return t('auth.biometrics')
  }, [biometryType, t])

  const biometricIcon = useMemo(() => {
    if (biometryType === BiometryTypes.FaceID) return '🪪'
    if (biometryType === BiometryTypes.TouchID) return '👆'
    return '🔐'
  }, [biometryType])

  const handleEnable = useCallback(async () => {
    setIsLoading(true)
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: t('auth.biometricPromptMessage'),
      })
      if (success) {
        dispatch(setBiometricEnabled(true))
        setToast({ msg: t('auth.biometricEnabled'), type: 'success' })
        setTimeout(() => navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME_TAB }] }), 1200)
      } else {
        setToast({ msg: t('auth.biometricFailed'), type: 'error' })
      }
    } catch {
      setToast({ msg: t('errors.generic'), type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, navigation, t])

  const handleSkip = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME_TAB }] })
  }, [navigation])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{biometricIcon}</Text>
        </View>

        <Text style={styles.title}>{t('auth.enableBiometrics')}</Text>
        <Text style={styles.subtitle}>
          {t('auth.biometricSubtitle', { type: biometricLabel })}
        </Text>

        {!biometryType && (
          <View style={styles.unavailableCard}>
            <Text style={styles.unavailableText}>{t('auth.biometricsUnavailable')}</Text>
          </View>
        )}

        <View style={styles.featureList}>
          {[
            t('auth.biometricFeature1'),
            t('auth.biometricFeature2'),
            t('auth.biometricFeature3'),
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureDot}>✦</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttons}>
        {biometryType && (
          <Button
            title={t('auth.enableBiometricButton', { type: biometricLabel })}
            onPress={handleEnable}
            loading={isLoading}
            style={styles.enableButton}
          />
        )}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.75}>
          <Text style={styles.skipText}>{t('common.skipForNow')}</Text>
        </TouchableOpacity>
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
    content: { flex: 1, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center' },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 12,
    },
    icon: { fontSize: 52 },
    title: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 28,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
      lineHeight: 22,
    },
    unavailableCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    unavailableText: { fontFamily: 'Poppins-Regular', fontSize: 13, color: colors.textMuted, textAlign: 'center' },
    featureList: { alignSelf: 'stretch', gap: 12 },
    featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    featureDot: { color: colors.primary, fontSize: 14, marginTop: 2 },
    featureText: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary },
    buttons: { paddingHorizontal: 24, paddingBottom: 32, gap: 8 },
    enableButton: {},
    skipButton: { alignItems: 'center', paddingVertical: 14 },
    skipText: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textMuted },
  })

export default BiometricSetupScreen
