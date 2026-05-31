import React, { memo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetOrderByIdQuery } from '@store/api/ordersApi'
import { ROUTES } from '@constants/routes'
import { formatCurrency } from '@shared/utils/formatCurrency'
import Button from '@shared/components/Button'

const OrderDetailScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { orderId } = route.params ?? {}

  const { data: order } = useGetOrderByIdQuery(orderId as string)

  if (!order) return null

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>Order #{order.id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <View style={[styles.statusCard, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text style={[typography.label, { color: colors.textSecondary }]}>Status</Text>
          <Text style={[typography.h4, { color: colors.primary }]}>{t(`orders.status.${order.status}` as never)}</Text>
          {order.estimatedDelivery && (
            <Text style={[typography.body2, { color: colors.textSecondary }]}>
              Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>Items</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.item}>
              <FastImage source={{ uri: item.imageUrl }} style={[styles.thumb, { borderRadius: radius.sm }]} />
              <View style={styles.itemInfo}>
                <Text style={[typography.body2, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
                {item.size && <Text style={[typography.caption, { color: colors.textMuted }]}>Size: {item.size}</Text>}
                <Text style={[typography.label, { color: colors.primary }]}>×{item.quantity} · {formatCurrency(item.price, order.currency)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>Payment Summary</Text>
          {[
            { label: 'Subtotal', value: formatCurrency(order.subtotal, order.currency) },
            { label: 'Shipping', value: formatCurrency(order.shipping, order.currency) },
            { label: 'Discount', value: `-${formatCurrency(order.discount, order.currency)}` },
          ].map(row => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={[typography.body2, { color: colors.textSecondary }]}>{row.label}</Text>
              <Text style={[typography.body2, { color: colors.textPrimary }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={[typography.h4, { color: colors.textPrimary }]}>Total</Text>
            <Text style={[typography.h4, { color: colors.primary }]}>{formatCurrency(order.total, order.currency)}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label={t('orders.trackOrder')}
            // @ts-ignore
            onPress={() => navigation.navigate(ROUTES.TRACKING, { orderId: order.id })}
            variant="primary"
          />
          {order.status === 'delivered' && (
            <Button
              label={t('orders.returnRequest')}
              // @ts-ignore
              onPress={() => navigation.navigate(ROUTES.RETURN_REQUEST, { orderId: order.id })}
              variant="secondary"
              style={{ marginTop: 12 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  statusCard: { padding: 16, gap: 4 },
  section: { padding: 16 },
  item: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  thumb: { width: 64, height: 80 },
  itemInfo: { flex: 1, gap: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  actions: { gap: 0 },
})

export default OrderDetailScreen
