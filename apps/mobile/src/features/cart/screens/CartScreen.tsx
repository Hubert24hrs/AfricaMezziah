import React, { memo, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } from '@store/api/cartApi'
import { formatCurrency } from '@shared/utils/formatCurrency'
import Button from '@shared/components/Button'
import EmptyState from '@shared/components/EmptyState'
import Skeleton from '@shared/components/Skeleton'
import { ROUTES } from '@shared/constants/routes'

const CartScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data: cart, isLoading } = useGetCartQuery()
  const [removeItem] = useRemoveCartItemMutation()
  const [updateItem] = useUpdateCartItemMutation()

  const handleQtyChange = useCallback((id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return }
    updateItem({ id, quantity: qty })
  }, [removeItem, updateItem])

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={{ padding: 16, gap: 12 }}>
          {[1,2,3].map(i => <Skeleton key={i} height={100} borderRadius={12} />)}
        </View>
      </SafeAreaView>
    )
  }

  if (!cart?.items.length) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <EmptyState title={t('cart.empty')} subtitle={t('cart.emptySubtitle')} icon="bag-outline"
          ctaLabel={t('cart.shopNow')} onCta={() => navigation.navigate(ROUTES.HOME_TAB)} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{t('cart.title')}</Text>
      <FlatList
        data={cart.items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: colors.surface }]}>
            <FastImage source={{ uri: item.product.images[0] }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={2}>{item.product.name}</Text>
              <Text style={[styles.itemVariant, { color: colors.textMuted }]}>{item.size} · {item.color}</Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>{formatCurrency(item.price, item.product.currency)}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => handleQtyChange(item.id, item.quantity - 1)} style={[styles.qtyBtn, { backgroundColor: colors.background }]}>
                  <Ionicons name="remove" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.qty, { color: colors.textPrimary }]}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleQtyChange(item.id, item.quantity + 1)} style={[styles.qtyBtn, { backgroundColor: colors.background }]}>
                  <Ionicons name="add" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={[styles.summary, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('cart.subtotal')}</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{formatCurrency(cart.subtotal, 'NGN')}</Text>
        </View>
        {cart.discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.success }]}>{t('cart.discount')}</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>-{formatCurrency(cart.discount, 'NGN')}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>{t('cart.total')}</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(cart.total, 'NGN')}</Text>
        </View>
        <Button label={t('cart.proceedToCheckout')} onPress={() => navigation.navigate(ROUTES.CHECKOUT)} fullWidth />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 20, padding: 16, paddingBottom: 8 },
  list: { padding: 12, gap: 12 },
  item: { flexDirection: 'row', borderRadius: 12, overflow: 'hidden', padding: 12, gap: 12 },
  image: { width: 80, height: 80, borderRadius: 8 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontFamily: 'Poppins-Regular', fontSize: 13 },
  itemVariant: { fontFamily: 'Poppins-Regular', fontSize: 11 },
  itemPrice: { fontFamily: 'Inter-Bold', fontSize: 15 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qty: { fontFamily: 'Poppins-SemiBold', fontSize: 15, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4 },
  summary: { padding: 16, borderTopWidth: 1, gap: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: 'Poppins-Regular', fontSize: 14 },
  summaryValue: { fontFamily: 'Poppins-SemiBold', fontSize: 14 },
  totalRow: { marginBottom: 4 },
  totalLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  totalValue: { fontFamily: 'Inter-Bold', fontSize: 18 },
})

export default CartScreen
