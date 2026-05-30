import React, { memo, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
import { ROUTES } from '@shared/constants/routes'

const CARD_BRAND_COLORS: Record<string, string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  verve: '#00A550',
}

interface PaymentMethodCardProps {
  method: PaymentMethod
  onDelete: (id: string) => void
  colors: ReturnType<typeof useTheme>['colors']
  t: (key: string) => string
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = memo(({ method, onDelete, colors, t }) => {
  const handleDelete = useCallback(() => onDelete(method.id), [method.id, onDelete])
  const brandColor = CARD_BRAND_COLORS[method.type.toLowerCase()] ?? colors.surface

  return (
    <View style={[cardStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[cardStyles.brandPill, { backgroundColor: brandColor }]}>
        <Text style={cardStyles.brandText}>{method.brand.toUpperCase()}</Text>
      </View>
      <View style={cardStyles.info}>
        <Text style={[cardStyles.number, { color: colors.textPrimary }]}>
          ••••  ••••  ••••  {method.last4}
        </Text>
        <Text style={[cardStyles.expiry, { color: colors.textMuted }]}>
          {t('payment.expires')} {method.expiry}
        </Text>
        {method.isDefault && (
          <View style={[cardStyles.defaultBadge, { borderColor: colors.primary }]}>
            <Text style={[cardStyles.defaultText, { color: colors.primary }]}>{t('payment.default')}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={handleDelete} activeOpacity={0.75} style={cardStyles.deleteBtn}>
        <Text style={[cardStyles.deleteIcon, { color: colors.error }]}>🗑</Text>
      </TouchableOpacity>
    </View>
  )
})

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brandPill: {
    width: 52,
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontFamily: 'Inter-Bold', fontSize: 10, color: '#fff' },
  info: { flex: 1 },
  number: { fontFamily: 'Inter-Bold', fontSize: 15, letterSpacing: 1 },
  expiry: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 3 },
  defaultBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  defaultText: { fontFamily: 'Poppins-Medium', fontSize: 10 },
  deleteBtn: { padding: 8 },
  deleteIcon: { fontSize: 18 },
})

/** Saved payment methods list with add new card button */
const PaymentMethodsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data: methods, isLoading } = useGetPaymentMethodsQuery()
  const [deleteMethod] = useDeletePaymentMethodMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t('payment.confirmDelete'), t('payment.confirmDeleteDesc'), [
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
      ])
    },
    [deleteMethod, t],
  )

  const renderItem = useCallback(
    ({ item }: { item: PaymentMethod }) => (
      <PaymentMethodCard method={item} onDelete={handleDelete} colors={colors} t={t} />
    ),
    [handleDelete, colors, t],
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
          keyExtractor={item => item.id}
          renderItem={renderItem}
          estimatedItemSize={100}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState title={t('payment.noCards')} description={t('payment.noCardsDesc')} />
          }
          ListFooterComponent={
            <Button
              title={t('payment.addPaymentMethod')}
              onPress={() => navigation.navigate(ROUTES.PAYMENT)}
              style={styles.addBtn}
              variant="secondary"
            />
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
    listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
    addBtn: { marginTop: 8 },
  })

export default PaymentMethodsScreen
