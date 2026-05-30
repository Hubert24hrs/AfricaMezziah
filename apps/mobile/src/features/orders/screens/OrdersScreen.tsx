import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetOrdersQuery, Order } from '@store/api/ordersApi'
import Badge from '@shared/components/Badge'
import EmptyState from '@shared/components/EmptyState'
import Skeleton from '@shared/components/Skeleton'
import { ROUTES } from '@shared/constants/routes'

const ORDER_TABS = ['active', 'completed', 'cancelled', 'returns'] as const
type OrderTab = typeof ORDER_TABS[number]

const TAB_STATUS_MAP: Record<OrderTab, string> = {
  active: 'processing',
  completed: 'delivered',
  cancelled: 'cancelled',
  returns: 'returned',
}

const STATUS_BADGE_TYPE: Record<string, 'new' | 'hot' | 'discount'> = {
  processing: 'hot',
  shipped: 'hot',
  delivered: 'new',
  cancelled: 'discount',
  returned: 'discount',
}

interface OrderCardProps {
  order: Order
  onPress: (orderId: string) => void
  colors: ReturnType<typeof useTheme>['colors']
  t: (key: string) => string
}

const OrderCard: React.FC<OrderCardProps> = memo(({ order, onPress, colors, t }) => {
  const handlePress = useCallback(() => onPress(order.id), [order.id, onPress])
  const firstImage = order.items[0]?.image

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View style={styles.cardTop}>
        {firstImage && (
          <FastImage
            source={{ uri: firstImage }}
            style={styles.thumbnail}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
        <View style={styles.cardInfo}>
          <Text style={[styles.orderId, { color: colors.textPrimary }]}>
            #{order.id.slice(-8).toUpperCase()}
          </Text>
          <Text style={[styles.orderDate, { color: colors.textMuted }]}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
            {order.items.length} {t('orders.items')}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.total, { color: colors.primary }]}>
            ₦{order.total.toLocaleString()}
          </Text>
          <Badge
            type={STATUS_BADGE_TYPE[order.status] ?? 'new'}
            label={t(`orders.status.${order.status}`)}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
})

/** Orders screen with Active / Completed / Cancelled / Returns tabs */
const OrdersScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [activeTab, setActiveTab] = useState<OrderTab>('active')

  const { data, isLoading } = useGetOrdersQuery({ status: TAB_STATUS_MAP[activeTab] })

  const handleOrderPress = useCallback(
    (orderId: string) => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId }),
    [navigation],
  )

  const renderItem = useCallback(
    ({ item }: { item: Order }) => (
      <OrderCard order={item} onPress={handleOrderPress} colors={colors} t={t} />
    ),
    [handleOrderPress, colors, t],
  )

  const keyExtractor = useCallback((item: Order) => item.id, [])

  const tabStyles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={tabStyles.container}>
      <View style={tabStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={tabStyles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={tabStyles.headerTitle}>{t('orders.myOrders')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={tabStyles.tabs}>
        {ORDER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              tabStyles.tab,
              activeTab === tab && tabStyles.tabActive,
            ]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                tabStyles.tabText,
                { color: activeTab === tab ? colors.primary : colors.textMuted },
              ]}
            >
              {t(`orders.tabs.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={tabStyles.skeletonList}>
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} width="100%" height={90} borderRadius={12} />)}
        </View>
      ) : (
        <FlashList
          data={data?.data ?? []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={100}
          contentContainerStyle={tabStyles.listContent}
          ListEmptyComponent={
            <EmptyState title={t('orders.empty')} description={t('orders.emptyDesc')} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  thumbnail: { width: 56, height: 56, borderRadius: 8 },
  cardInfo: { flex: 1 },
  orderId: { fontFamily: 'Inter-Bold', fontSize: 14 },
  orderDate: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  itemCount: { fontFamily: 'Poppins-Regular', fontSize: 12, marginTop: 4 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  total: { fontFamily: 'Inter-Bold', fontSize: 15 },
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
    tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: colors.primary },
    tabText: { fontFamily: 'Poppins-Medium', fontSize: 12 },
    listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
    skeletonList: { padding: 16, gap: 12 },
  })

export default OrdersScreen
