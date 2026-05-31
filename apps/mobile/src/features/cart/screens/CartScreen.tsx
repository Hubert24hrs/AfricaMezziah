import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } from '@store/api/cartApi'
import { ROUTES } from '@constants/routes'
import Button from '@shared/components/Button'
import EmptyState from '@shared/components/EmptyState'
import { formatCurrency } from '@shared/utils/formatCurrency'
import { enableScreenshotPrevention, disableScreenshotPrevention } from '@services/securityService'
import type { CartItem } from '../cart.types'

const CartScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()

  const { data: cart, isLoading } = useGetCartQuery()
  const [removeItem] = useRemoveCartItemMutation()
  const [updateItem] = useUpdateCartItemMutation()

  const handleRemove = useCallback(
    (id: string) => {
      Alert.alert(t('cart.removeItem'), 'Remove this item from your cart?', [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => { void removeItem(id) } },
      ])
    },
    [removeItem, t],
  )

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <View style={[styles.item, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}>
        <FastImage source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.itemInfo}>
          <Text style={[typography.body2, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
          {item.size && <Text style={[typography.caption, { color: colors.textMuted }]}>Size: {item.size}</Text>}
          <Text style={[typography.price, { color: colors.primary }]}>{formatCurrency(item.price, item.currency)}</Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, { borderColor: colors.border, borderRadius: radius.sm }]}
              onPress={() => { void updateItem({ id: item.id, quantity: Math.max(1, item.quantity - 1) }) }}
            >
              <Text style={{ color: colors.textPrimary }}>−</Text>
            </TouchableOpacity>
            <Text style={[typography.label, { color: colors.textPrimary, minWidth: 32, textAlign: 'center' }]}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              style={[styles.qtyBtn, { borderColor: colors.border, borderRadius: radius.sm }]}
              onPress={() => { void updateItem({ id: item.id, quantity: item.quantity + 1 }) }}
            >
              <Text style={{ color: colors.textPrimary }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.deleteBtn}>
          <Text style={{ color: colors.error, fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    ),
    [colors, typography, radius, shadows, updateItem, handleRemove],
  )

  if (!cart?.items?.length) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Text style={[typography.h4, { color: colors.textPrimary, padding: spacing.md }]}>{t('cart.title')}</Text>
        <EmptyState
          emoji="🛒"
          title={t('cart.empty')}
          subtitle={t('cart.emptySubtitle')}
          actionLabel={t('cart.shopNow')}
          // @ts-ignore
          onAction={() => navigation.navigate(ROUTES.TAB_HOME)}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[typography.h4, { color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: 16 }]}>
        {t('cart.title')} ({cart.itemCount})
      </Text>

      <FlashList
        data={cart.items}
        estimatedItemSize={120}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm, paddingBottom: 200 } as any}
        renderItem={renderItem}
      />

      {/* Order Summary */}
      <View style={[styles.summary, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[typography.body2, { color: colors.textSecondary }]}>{t('cart.subtotal')}</Text>
          <Text style={[typography.body2, { color: colors.textPrimary }]}>{formatCurrency(cart.subtotal, cart.currency)}</Text>
        </View>
        {cart.discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[typography.body2, { color: colors.success }]}>{t('cart.discount')}</Text>
            <Text style={[typography.body2, { color: colors.success }]}>-{formatCurrency(cart.discount, cart.currency)}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={[typography.body2, { color: colors.textSecondary }]}>{t('cart.shipping')}</Text>
          <Text style={[typography.body2, { color: cart.shipping === 0 ? colors.success : colors.textPrimary }]}>
            {cart.shipping === 0 ? t('cart.freeShipping') : formatCurrency(cart.shipping, cart.currency)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('cart.total')}</Text>
          <Text style={[typography.h4, { color: colors.primary }]}>{formatCurrency(cart.total, cart.currency)}</Text>
        </View>
        <Button
          label={t('cart.checkout')}
          onPress={() => {
            void enableScreenshotPrevention()
            // @ts-ignore
            navigation.navigate(ROUTES.CHECKOUT)
          }}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { flexDirection: 'row', padding: 12, gap: 12 },
  itemImage: { width: 80, height: 100, borderRadius: 8 },
  itemInfo: { flex: 1, gap: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  deleteBtn: { padding: 4 },
  summary: { padding: 16, gap: 8, borderTopWidth: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { paddingTop: 8, borderTopWidth: 1, marginTop: 4, marginBottom: 12 },
})

export default CartScreen
