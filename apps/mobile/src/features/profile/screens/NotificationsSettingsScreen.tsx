import React, { memo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'

const NOTIFICATION_PREFS = [
  { key: 'orders', label: 'Order Updates', icon: '📦' },
  { key: 'promotions', label: 'Promotions & Offers', icon: '🎁' },
  { key: 'flashSales', label: 'Flash Sales', icon: '⚡' },
  { key: 'priceDrops', label: 'Price Drops on Wishlist', icon: '💰' },
  { key: 'newArrivals', label: 'New Arrivals', icon: '✨' },
  { key: 'system', label: 'System Notifications', icon: 'ℹ️' },
]

const NotificationsSettingsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map(p => [p.key, true])),
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('profile.notifications')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          {NOTIFICATION_PREFS.map((pref, i) => (
            <View
              key={pref.key}
              style={[
                styles.row,
                i < NOTIFICATION_PREFS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={styles.icon}>{pref.icon}</Text>
              <Text style={[typography.body1, { color: colors.textPrimary, flex: 1 }]}>{pref.label}</Text>
              <Switch
                value={prefs[pref.key]}
                onValueChange={val => setPrefs(prev => ({ ...prev, [pref.key]: val }))}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  section: { overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  icon: { fontSize: 20 },
})

export default NotificationsSettingsScreen
