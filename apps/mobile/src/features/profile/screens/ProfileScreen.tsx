import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { logout } from '@features/auth/authSlice'
import { useGetMeQuery } from '@store/api/userApi'
import { useLogoutMutation } from '@store/api/authApi'
import { clearTokens, getRefreshToken } from '@services/keychainService'
import { ROUTES } from '@constants/routes'

interface MenuItem {
  icon: string
  label: string
  route: string
  badge?: number
}

const MENU_ITEMS: MenuItem[][] = [
  [
    { icon: '📦', label: 'profile.orders', route: ROUTES.ORDERS },
    { icon: '❤️', label: 'profile.wishlist', route: ROUTES.WISHLIST },
    { icon: '📍', label: 'profile.addresses', route: ROUTES.ADDRESS_BOOK },
    { icon: '💳', label: 'profile.paymentMethods', route: ROUTES.PAYMENT_METHODS },
  ],
  [
    { icon: '🔔', label: 'profile.notifications', route: ROUTES.NOTIFICATIONS_SETTINGS },
    { icon: '🔒', label: 'profile.security', route: ROUTES.SECURITY_SETTINGS },
    { icon: '🛡️', label: 'profile.privacy', route: ROUTES.PRIVACY_SETTINGS },
  ],
  [
    { icon: '🌐', label: 'profile.language', route: ROUTES.LANGUAGE_SCREEN },
    { icon: '🎨', label: 'profile.theme', route: ROUTES.THEME_SCREEN },
    { icon: '🤖', label: 'AI Stylist', route: ROUTES.AI_ASSISTANT },
    { icon: '❓', label: 'profile.helpCenter', route: ROUTES.HELP_CENTER },
  ],
]

const ProfileScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const { data: user } = useGetMeQuery()
  const [logoutMutation] = useLogoutMutation()

  const handleLogout = useCallback(() => {
    Alert.alert(t('auth.logout'), 'Are you sure you want to log out?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: async () => {
          const refreshToken = await getRefreshToken()
          if (refreshToken) {
            await logoutMutation({ refreshToken })
          }
          await clearTokens()
          dispatch(logout())
        },
      },
    ])
  }, [dispatch, logoutMutation, t])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.secondary, colors.background]}
          style={styles.heroSection}
        >
          <View style={styles.avatarRow}>
            <TouchableOpacity
              // @ts-ignore
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            >
              {user?.avatar ? (
                <FastImage source={{ uri: user.avatar }} style={[styles.avatar, { borderColor: colors.primary }]} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                  <Text style={[typography.h3, { color: colors.textInverse }]}>
                    {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={[typography.h4, { color: colors.textPrimary }]}>{user?.name ?? '-'}</Text>
              <Text style={[typography.body2, { color: colors.textSecondary }]}>{user?.email ?? '-'}</Text>
              <View style={[styles.tierBadge, { backgroundColor: `${colors.primary}33`, borderColor: colors.primary }]}>
                <Text style={[typography.caption, { color: colors.primary }]}>
                  ⭐ {user?.tier ?? 'Bronze'} · {user?.loyaltyPoints ?? 0} pts
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Groups */}
        {MENU_ITEMS.map((group, gi) => (
          <View
            key={gi}
            style={[styles.menuGroup, { backgroundColor: colors.surface, borderRadius: radius.lg, marginHorizontal: spacing.md, marginBottom: 12, ...shadows.card }]}
          >
            {group.map((item, ii) => (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.menuItem,
                  ii < group.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
                // @ts-ignore
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.75}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[typography.body1, { color: colors.textPrimary, flex: 1 }]}>{t(item.label as never)}</Text>
                <Text style={{ color: colors.textMuted }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { marginHorizontal: spacing.md, marginBottom: 32 }]}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Text style={[typography.body1, { color: colors.error }]}>🚪 {t('auth.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroSection: { padding: 24, paddingBottom: 32 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3 },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  userInfo: { flex: 1, gap: 4 },
  tierBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  menuGroup: { overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuIcon: { fontSize: 20, width: 28 },
  logoutBtn: { padding: 16, alignItems: 'center', justifyContent: 'center' },
})

export default ProfileScreen
