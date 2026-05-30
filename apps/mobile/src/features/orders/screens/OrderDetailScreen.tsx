import React, { memo, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetOrderQuery, OrderItem } from '@store/api/ordersApi'
import Button from '@shared/components/Button'
import { ROUTES } from '@shared/constants/routes'

type OrderDetailRouteParams = {
  OrderDetail: { orderId: string }
}

const TIMELINE_STEPS = ['pending', 'processing', 'shipped', 'delivered']

/** Full order detail with items, address, payment, timeline */
const OrderDetailScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<OrderDetailRouteParams, 'OrderDetail'>>()
  const { orderId } = route.params

  const { data: order, isLoading } = useGetOrderQuery(orderId)

  const currentStepIndex = useMemo(() => {
    if (!order) return -1
    return TIMELINE_STEPS.indexOf(order.status)
  }, [order])

  const handleTrack = useCallback(() => {
    navigation.navigate(ROUTES.TRACKING, { orderId })
  }, [navigation, orderId])

  const handleReturn = useCallback(() => {
    navigation.navigate(ROUTES.RETURN_REQUEST, { orderId })
  }, [navigation, orderId])

  const styles = useMemo(() => createStyles(colors), [colors])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }

  if (!order) return null

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('orders.orderDetail')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Order ID & Date */}
        <View style={styles.section}>
          <View style={styles.idRow}>
            <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>
            <Text style={[styles.status, { color: colors.primary }]}>
              {t(`orders.status.${order.status}`)}
            </Text>
          </View>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orders.statusTimeline')}</Text>
          {TIMELINE_STEPS.map((step, idx) => {
            const done = idx <= currentStepIndex
            return (
              <View key={step} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      { backgroundColor: done ? colors.primary : colors.border },
                    ]}
                  />
                  {idx < TIMELINE_STEPS.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: idx < currentStepIndex ? colors.primary : colors.border },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    { color: done ? colors.textPrimary : colors.textMuted },
                  ]}
                >
                  {t(`orders.timeline.${step}`)}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orders.items')}</Text>
          {order.items.map((item: OrderItem, i: number) => (
            <View key={i} style={styles.itemRow}>
              <FastImage
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.size} · {item.color} · x{item.quantity}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orders.shippingAddress')}</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.infoText}>
              {order.address.line1}, {order.address.city}, {order.address.state}, {order.address.country}
            </Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orders.payment')}</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.infoText}>{order.paymentMethod}</Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cart.orderSummary')}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.total')}</Text>
            <Text style={[styles.summaryValue, { color: colors.primary, fontFamily: 'Inter-Bold', fontSize: 18 }]}>
              ₦{order.total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          {order.trackingNumber && (
            <Button title={t('orders.trackOrder')} onPress={handleTrack} style={styles.actionBtn} />
          )}
          {order.status === 'delivered' && (
            <Button
              title={t('orders.requestReturn')}
              onPress={handleReturn}
              variant="secondary"
              style={styles.actionBtn}
            />
          )}
        </View>

        <View style={{ height: 40 }} />
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
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    orderId: { fontFamily: 'Inter-Bold', fontSize: 18, color: colors.textPrimary },
    status: { fontFamily: 'Poppins-SemiBold', fontSize: 14 },
    orderDate: { fontFamily: 'Poppins-Regular', fontSize: 13, color: colors.textMuted },
    sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 14 },
    timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
    timelineLeft: { alignItems: 'center', width: 24, marginRight: 14 },
    timelineDot: { width: 16, height: 16, borderRadius: 8 },
    timelineLine: { width: 2, height: 24, marginTop: 2 },
    timelineLabel: { fontFamily: 'Poppins-Regular', fontSize: 14, paddingBottom: 20, flex: 1 },
    itemRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
    itemImage: { width: 64, height: 64, borderRadius: 8 },
    itemInfo: { flex: 1 },
    itemName: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textPrimary },
    itemMeta: { fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },
    itemPrice: { fontFamily: 'Inter-Bold', fontSize: 14, marginTop: 4 },
    infoCard: { borderRadius: 12, padding: 14 },
    infoText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary },
    summaryValue: { fontFamily: 'Inter-Regular', fontSize: 16, color: colors.textPrimary },
    actionsSection: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
    actionBtn: {},
  })

export default OrderDetailScreen
