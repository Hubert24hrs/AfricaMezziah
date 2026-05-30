import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { MMKV } from 'react-native-mmkv'
import { useTheme } from '@shared/hooks/useTheme'

const storage = new MMKV({ id: 'notification-prefs' })

interface NotificationCategory {
  key: string
  titleKey: string
  descKey: string
  icon: string
}

const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  { key: 'order_updates', titleKey: 'notifications.orderUpdates', descKey: 'notifications.orderUpdatesDesc', icon: '📦' },
  { key: 'promotions', titleKey: 'notifications.promotions', descKey: 'notifications.promotionsDesc', icon: '🎉' },
  { key: 'flash_sales', titleKey: 'notifications.flashSales', descKey: 'notifications.flashSalesDesc', icon: '⚡' },
  { key: 'new_arrivals', titleKey: 'notifications.newArrivals', descKey: 'notifications.newArrivalsDesc', icon: '✨' },
  { key: 'price_drops', titleKey: 'notifications.priceDrops', descKey: 'notifications.priceDropsDesc', icon: '📉' },
  { key: 'live_streams', titleKey: 'notifications.liveStreams', descKey: 'notifications.liveStreamsDesc', icon: '🎥' },
  { key: 'chat_messages', titleKey: 'notifications.chatMessages', descKey: 'notifications.chatMessagesDesc', icon: '💬' },
]

function getStoredPrefs(): Record<string, boolean> {
  try {
    const raw = storage.getString('notification_prefs')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Notification preferences with per-category toggles, persisted in MMKV */
const NotificationsSettingsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()

  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
    const stored = getStoredPrefs()
    const defaults: Record<string, boolean> = {}
    NOTIFICATION_CATEGORIES.forEach(c => {
      defaults[c.key] = stored[c.key] ?? true
    })
    return defaults
  })

  const handleToggle = useCallback((key: string, value: boolean) => {
    setPrefs(prev => {
      const updated = { ...prev, [key]: value }
      storage.set('notification_prefs', JSON.stringify(updated))
      return updated
    })
  }, [])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications.settings')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>{t('notifications.settingsHint')}</Text>

        {NOTIFICATION_CATEGORIES.map(category => (
          <View key={category.key} style={styles.row}>
            <Text style={styles.rowIcon}>{category.icon}</Text>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{t(category.titleKey)}</Text>
              <Text style={[styles.rowDesc, { color: colors.textMuted }]}>{t(category.descKey)}</Text>
            </View>
            <Switch
              value={prefs[category.key] ?? true}
              onValueChange={v => handleToggle(category.key, v)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>
        ))}
      </ScrollView>
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
    hint: {
      fontFamily: 'Poppins-Regular',
      fontSize: 13,
      color: colors.textMuted,
      paddingHorizontal: 20,
      paddingVertical: 16,
      lineHeight: 20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 14,
    },
    rowIcon: { fontSize: 24, width: 32, textAlign: 'center' },
    rowInfo: { flex: 1 },
    rowTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
    rowDesc: { fontFamily: 'Poppins-Regular', fontSize: 12, marginTop: 2, lineHeight: 18 },
  })

export default NotificationsSettingsScreen
