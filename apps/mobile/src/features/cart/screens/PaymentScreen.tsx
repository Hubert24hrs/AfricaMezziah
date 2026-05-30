import React, { memo, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetPaymentMethodsQuery, useDeletePaymentMethodMutation, PaymentMethod } from '@store/api/userApi'
import Button from '@shared/components/Button'
import EmptyState from '@shared/components/EmptyState'
import Toast from '@shared/components/Toast'
import { useState } from 'react'

// SECURITY NOTE: Screenshot prevention must be applied to this screen.
// On Android: FLAG_SECURE via native module. On iOS: RCTSecureView overlay.

const CARD_BRAND_ICONS: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  verve: '💳',
  default: '💳',
}

const PAYMENT_OPTIONS = [
  { key: 'paystack', label: 'Paystack', icon: '🟢', description: 'Pay with Paystack' },
  { key: 'flutterwave', label: 'Flutterwave', icon: '🌊', description: 'Pay with Flutterwave' },
  { key: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
  { key: 'wallet', label: 'Wallet', icon: '👛', description: 'Pay from wallet balance' },
  { key: 'cod', label: 'Cash on Delivery', icon: '💵', description: 'Pay when delivered' },
]

interface PaymentCardRowProps {
  method: PaymentMethod
  onDelete: (id: string) => void
  colors: ReturnType<typeof useTheme>['colors']
  t: (key: string, opts?: Record<string, string | number>) => string
}

const PaymentCardRow: React.FC<PaymentCardRowProps> = memo(({ method, onDelete, colors, t }) => {
  const icon = CARD_BRAND_ICONS[method.brand.toLowerCase()] ?? CARD_BRAND_ICONS.default
  const handleDelete = useCallback(() => onDelete(method.id), [method.id, onDelete])

  return (
    <View style={[cardStyles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={cardStyles.icon}>{icon}</Text>
      <View style={cardStyles.info}>
        <Text style={[cardStyles.brand, { color: colors.textPrimary }]}>
          {method.brand.toUpperCase()} ••••{method.last4}
        </Text>
        <Text style={[cardStyles.expiry, { color: colors.textMuted }]}>
          {t('payment.expires')} {method.expiry}
        </Text>
        {method.isDefault && (
          <Text style={[cardStyles.default, { color: colors.primary }]}>{t('payment.default')}</Text>
        )}
      </View>
      <TouchableOpacity onPress={handleDelete} activeOpacity={0.75} style={cardStyles.deleteBtn}>
        <Text style={[cardStyles.deleteText, { color: colors.error }]}>🗑</Text>
      </TouchableOpacity>
    </View>
  )
})

const cardStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  icon: { fontSize: 28 },
  info: { flex: 1 },
  brand: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
  expiry: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  default: { fontFamily: 'Poppins-Medium', fontSize: 11, marginTop: 4 },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 18 },
})

/** Payment methods screen with saved cards and alternative payment options */
const PaymentScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data: methods, isLoading } = useGetPaymentMethodsQuery()
  const [deleteMethod, { isLoading: isDeleting }] = useDeletePaymentMethodMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        t('payment.confirmDelete'),
        t('payment.confirmDeleteDesc'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteMethod(id).unwrap()
                setToast({ msg: t('payment.deleted'), type: 'success' })
              } catch {
                setToast({ msg: t('errors.generic'), type: 'error' })
              }
            },
          },
        ],
      )
    },
    [deleteMethod, t],
  )

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('payment.paymentMethods')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlashList
          data={methods ?? []}
          estimatedItemSize={82}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>{t('payment.savedCards')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 20 }}>
              <PaymentCardRow method={item} onDelete={handleDelete} colors={colors} t={t} />
            </View>
          )}
          ListEmptyComponent={
            <View style={{ paddingHorizontal: 20 }}>
              <EmptyState title={t('payment.noCards')} description={t('payment.noCardsDesc')} />
            </View>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.sectionTitle}>{t('payment.otherOptions')}</Text>
              {PAYMENT_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.optionRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  activeOpacity={0.75}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{option.label}</Text>
                    <Text style={[styles.optionDesc, { color: colors.textMuted }]}>{option.description}</Text>
                  </View>
                  <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
                </TouchableOpacity>
              ))}
              <Button title={t('payment.addNewCard')} onPress={() => {}} style={styles.addBtn} />
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
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
    listHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
    sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 12 },
    footer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 10,
      gap: 14,
    },
    optionIcon: { fontSize: 26 },
    optionInfo: { flex: 1 },
    optionLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
    optionDesc: { fontFamily: 'Poppins-Regular', fontSize: 12, marginTop: 2 },
    chevron: { fontSize: 22 },
    addBtn: { marginTop: 12 },
  })

export default PaymentScreen
