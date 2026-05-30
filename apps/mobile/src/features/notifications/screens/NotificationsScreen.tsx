import React, { memo } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import EmptyState from '@shared/components/EmptyState'
import { formatRelativeDate } from '@shared/utils/formatDate'

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Order Shipped!', body: 'Your order #ABC123 has been shipped and is on its way.', type: 'order', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', title: 'Flash Sale Starts Now', body: 'Up to 70% off on selected African prints. Limited time!', type: 'promo', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', title: 'Price Drop Alert', body: 'An item in your wishlist has dropped in price.', type: 'wishlist', read: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
]

const ICON_MAP: Record<string, string> = { order: 'cube', promo: 'pricetag', wishlist: 'heart', security: 'shield', message: 'chatbubble' }

const NotificationsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('notifications.title')}</Text>
        <TouchableOpacity>
          <Text style={[styles.markAll, { color: colors.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>
      {!MOCK_NOTIFICATIONS.length ? (
        <EmptyState title={t('notifications.empty')} icon="notifications-outline" />
      ) : (
        <FlatList
          data={MOCK_NOTIFICATIONS}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.item, { backgroundColor: item.read ? 'transparent' : colors.surface + '80', borderBottomColor: colors.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
                <Ionicons name={ICON_MAP[item.type] as any ?? 'notifications'} size={20} color={colors.primary} />
              </View>
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                  {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.itemBody, { color: colors.textSecondary }]} numberOfLines={2}>{item.body}</Text>
                <Text style={[styles.itemTime, { color: colors.textMuted }]}>{formatRelativeDate(item.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
  markAll: { fontFamily: 'Poppins-Regular', fontSize: 13 },
  list: { paddingBottom: 24 },
  item: { flexDirection: 'row', padding: 16, gap: 12, borderBottomWidth: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  itemContent: { flex: 1 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  itemTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 14, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  itemBody: { fontFamily: 'Poppins-Regular', fontSize: 13, lineHeight: 19 },
  itemTime: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 4 },
})

export default NotificationsScreen
