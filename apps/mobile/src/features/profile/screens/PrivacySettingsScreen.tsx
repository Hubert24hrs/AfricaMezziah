import React, { memo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useDeleteAccountMutation } from '@store/api/userApi'
import { useAppDispatch } from '@store/store'
import { logout } from '@features/auth/authSlice'
import { clearTokens } from '@services/keychainService'

const PrivacySettingsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const [deleteAccount] = useDeleteAccountMutation()

  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.privacy.deleteAccount'),
      t('settings.privacy.deleteAccountConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteAccount()
            await clearTokens()
            dispatch(logout())
          },
        },
      ],
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('settings.privacy.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text style={[typography.body2, { color: colors.textSecondary, padding: 16 }]}>
            Africa Mezziah is committed to protecting your privacy. We collect only the data necessary to provide our services and never sell your personal information.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.dangerBtn, { borderColor: colors.error, borderRadius: radius.lg }]}
          onPress={handleDeleteAccount}
        >
          <Text style={[typography.label, { color: colors.error }]}>🗑️ {t('settings.privacy.deleteAccount')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  section: { overflow: 'hidden' },
  dangerBtn: { padding: 16, borderWidth: 1, alignItems: 'center' },
})

export default PrivacySettingsScreen
