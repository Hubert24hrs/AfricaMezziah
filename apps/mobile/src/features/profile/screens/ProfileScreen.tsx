import React, { memo, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProfileQuery } from '@store/api/userApi'
import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/constants/routes'

interface MenuItemProps { icon: string; label: string; onPress: () => void; badge?: string | number }

const MenuItem: React.FC<MenuItemProps> = memo(({ icon, label, onPress, badge }) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={onPress}>
      <Ionicons name={icon as any} size={20} color={colors.primary} />
      <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{label}</Text>
      <View style={styles.menuRight}>
        {badge && <View style={[styles.badge, { backgroundColor: colors.accent }]}><Text style={styles.badgeText}>{badge}</Text></View>}
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  )
})

const ProfileScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data: profile } = useGetProfileQuery()
  const { signOut } = useAuth()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatarWrap, { borderColor: colors.primary }]}>
            {profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person" size={40} color={colors.primary} />
            )}
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{profile?.name ?? 'User'}</Text>
          <Text style={[styles.email, { color: colors.textMuted }]}>{profile?.email}</Text>
          <View style={styles.loyaltyRow}>
            <Ionicons name="star" size={14} color={colors.primary} />
            <Text style={[styles.loyalty, { color: colors.primary }]}>{profile?.loyaltyPoints ?? 0} points</Text>
          </View>
          <TouchableOpacity style={[styles.editBtn, { borderColor: colors.primary }]} onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}>
            <Text style={[styles.editText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <MenuItem icon="bag" label="My Orders" onPress={() => navigation.navigate(ROUTES.ORDERS)} />
          <MenuItem icon="heart" label="Wishlist" onPress={() => navigation.navigate(ROUTES.WISHLIST)} />
          <MenuItem icon="sparkles" label="AI Stylist" onPress={() => navigation.navigate(ROUTES.AI_ASSISTANT)} />
          <MenuItem icon="location" label="Address Book" onPress={() => navigation.navigate(ROUTES.ADDRESS_BOOK)} />
          <MenuItem icon="card" label="Payment Methods" onPress={() => navigation.navigate(ROUTES.PAYMENT_METHODS)} />
        </View>

        <View style={styles.section}>
          <MenuItem icon="notifications" label="Notifications" onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS_SETTINGS)} />
          <MenuItem icon="shield-checkmark" label="Security" onPress={() => navigation.navigate(ROUTES.SECURITY_SETTINGS)} />
          <MenuItem icon="eye" label="Privacy" onPress={() => navigation.navigate(ROUTES.PRIVACY_SETTINGS)} />
          <MenuItem icon="moon" label="Theme" onPress={() => navigation.navigate(ROUTES.THEME_SETTINGS)} />
          <MenuItem icon="language" label="Language" onPress={() => navigation.navigate(ROUTES.LANGUAGE_SETTINGS)} />
        </View>

        <View style={styles.section}>
          <MenuItem icon="help-circle" label="Help Center" onPress={() => navigation.navigate(ROUTES.HELP_CENTER)} />
          <MenuItem icon="information-circle" label="About" onPress={() => navigation.navigate(ROUTES.ABOUT)} />
        </View>

        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.error }]} onPress={signOut}>
          <Ionicons name="log-out" size={18} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  profileHeader: { alignItems: 'center', padding: 24, gap: 6, marginBottom: 8 },
  avatarWrap: { width: 80, height: 80, borderRadius: 40, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 8 },
  avatar: { width: '100%', height: '100%' },
  name: { fontFamily: 'Poppins-SemiBold', fontSize: 20 },
  email: { fontFamily: 'Poppins-Regular', fontSize: 13 },
  loyaltyRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  loyalty: { fontFamily: 'Poppins-Medium', fontSize: 13 },
  editBtn: { marginTop: 12, borderWidth: 1.5, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 24 },
  editText: { fontFamily: 'Poppins-SemiBold', fontSize: 13 },
  section: { marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, gap: 14, borderBottomWidth: 1 },
  menuLabel: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 15 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontFamily: 'Inter-Bold', fontSize: 10, color: '#fff' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 20, borderWidth: 1.5, borderRadius: 12, paddingVertical: 14 },
  logoutText: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
})

export default ProfileScreen
