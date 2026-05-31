import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetOrdersQuery } from '@store/api/ordersApi'
import { ROUTES } from '@constants/routes'
import EmptyState from '@shared/components/EmptyState'
import { formatCurrency } from '@shared/utils/formatCurrency'
import type { Order } from '../orders.types'

const TABS = ['processing', 'delivered', 'cancelled', 'returned'] as const

const OrdersScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<string>('processing')

  const { data } = useGetOrdersQuery({ status: activeTab, limit: 20 })

  const renderOrder = useCallback(
    ({ item }: { item: Order }) => (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}
        // @ts-ignore
        onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={[typography.label, { color: colors.textPrimary }]}>{t('orders.orderNumber', { number: item.id })}</Text>
          <Text style={[typography.caption, { color: colors.primary }]}>
            {t(`orders.status.${item.status}` as never)}
          </Text>
        </View>

        <View style={styles.itemsRow}>
          {item.items.slice(0, 3).map(i => (
            <FastImage key={i.id} source={{ uri: i.imageUrl }} style={[styles.itemThumb, { borderRadius: radius.sm }]} />
          ))}
          {item.items.length > 3 && (
            <View style={[styles.moreThumb, { backgroundColor: colors.surfaceHover, borderRadius: radius.sm }]}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>+{item.items.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <Text style={[typography.label, { color: colors.primary }]}>{formatCurrency(item.total, item.currency)}</Text>
        </View>
      </TouchableOpacity>
    ),
    [colors, typography, radius, shadows, navigation, t],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('orders.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.tabs, { borderBottomColor: colors.border, paddingHorizontal: spacing.md }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[typography.label, { color: activeTab === tab ? colors.primary : colors.textMuted }]}>
              {t(`orders.${tab}` as never)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(data?.data ?? []).length === 0 ? (
        <EmptyState emoji="📦" title="No orders yet" />
      ) : (
        <FlashList
          data={data?.data ?? []}
          estimatedItemSize={160}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm } as any}
          renderItem={renderOrder}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  card: { padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemsRow: { flexDirection: 'row', gap: 8 },
  itemThumb: { width: 60, height: 72 },
  moreThumb: { width: 60, height: 72, alignItems: 'center', justifyContent: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
})

export default OrdersScreen
