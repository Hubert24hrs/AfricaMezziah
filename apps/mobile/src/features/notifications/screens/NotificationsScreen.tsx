import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetNotificationsQuery, useMarkAllReadMutation, useDeleteNotificationMutation } from '@store/api/notificationsApi'
import EmptyState from '@shared/components/EmptyState'
import type { Notification } from '../notifications.types'

const TYPE_ICONS: Record<string, string> = {
  order: '📦',
  promo: '🎁',
  flash: '⚡',
  system: 'ℹ️',
}

const NotificationsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const { data } = useGetNotificationsQuery({})
  const [markAllRead] = useMarkAllReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()

  const renderNotif = useCallback(
    ({ item }: { item: Notification }) => (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: item.isRead ? colors.surface : `${colors.primary}11`,
            borderRadius: radius.lg,
            borderLeftColor: item.isRead ? 'transparent' : colors.primary,
          },
        ]}
        onPress={() => { void deleteNotification(item.id) }}
        activeOpacity={0.85}
      >
        <Text style={styles.icon}>{TYPE_ICONS[item.type] ?? '🔔'}</Text>
        <View style={styles.content}>
          <Text style={[typography.label, { color: colors.textPrimary }]}>{item.title}</Text>
          <Text style={[typography.body2, { color: colors.textSecondary }]} numberOfLines={2}>{item.body}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {!item.isRead && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
      </TouchableOpacity>
    ),
    [colors, typography, radius, deleteNotification],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('notifications.title')}</Text>
        <TouchableOpacity onPress={() => { void markAllRead() }}>
          <Text style={[typography.caption, { color: colors.primary }]}>{t('notifications.markAllRead')}</Text>
        </TouchableOpacity>
      </View>

      {(data?.data ?? []).length === 0 ? (
        <EmptyState emoji="🔔" title={t('notifications.empty')} />
      ) : (
        <FlashList
          data={data?.data ?? []}
          estimatedItemSize={100}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm } as any}
          renderItem={renderNotif}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  card: { flexDirection: 'row', padding: 16, gap: 12, borderLeftWidth: 3 },
  icon: { fontSize: 24, width: 32 },
  content: { flex: 1, gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
})

export default NotificationsScreen
