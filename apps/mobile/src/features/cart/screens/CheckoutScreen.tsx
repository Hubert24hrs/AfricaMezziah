import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetCartQuery } from '@store/api/cartApi'
import { useGetAddressesQuery } from '@store/api/userApi'
import { useGetPaymentMethodsQuery } from '@store/api/userApi'
import { useCreateOrderMutation } from '@store/api/ordersApi'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { ROUTES } from '@shared/constants/routes'
import { Address, PaymentMethod } from '@store/api/userApi'

type Step = 1 | 2 | 3 | 4

interface StepIndicatorProps {
  current: Step
  colors: ReturnType<typeof useTheme>['colors']
  t: (key: string) => string
}

const STEP_LABELS = ['checkout.address', 'checkout.payment', 'checkout.review', 'checkout.confirm']

const StepIndicator: React.FC<StepIndicatorProps> = memo(({ current, colors, t }) => (
  <View style={stepStyles.container}>
    {([1, 2, 3, 4] as const).map((step, i) => (
      <React.Fragment key={step}>
        <View style={stepStyles.stepWrap}>
          <View
            style={[
              stepStyles.dot,
              {
                backgroundColor: current >= step ? colors.primary : colors.surface,
                borderColor: current >= step ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                stepStyles.dotNum,
                { color: current >= step ? colors.textInverse : colors.textMuted },
              ]}
            >
              {current > step ? '✓' : step}
            </Text>
          </View>
          <Text
            style={[stepStyles.stepLabel, { color: current >= step ? colors.primary : colors.textMuted }]}
            numberOfLines={1}
          >
            {t(STEP_LABELS[i])}
          </Text>
        </View>
        {i < 3 && (
          <View style={[stepStyles.line, { backgroundColor: current > step ? colors.primary : colors.border }]} />
        )}
      </React.Fragment>
    ))}
  </View>
))

const stepStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 16 },
  stepWrap: { alignItems: 'center', width: 52 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotNum: { fontSize: 12, fontFamily: 'Inter-Bold' },
  stepLabel: { fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 4, textAlign: 'center' },
  line: { flex: 1, height: 1.5, marginTop: 14 },
})

/** 4-step checkout wizard: Address → Payment → Review → Confirm */
const CheckoutScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()

  const { data: cart } = useGetCartQuery()
  const { data: addresses } = useGetAddressesQuery()
  const { data: paymentMethods } = useGetPaymentMethodsQuery()
  const [createOrder, { isLoading: isPlacing }] = useCreateOrderMutation()

  const [step, setStep] = useState<Step>(1)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses?.find(a => a.isDefault) ?? null,
  )
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    paymentMethods?.find(p => p.isDefault) ?? null,
  )
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const handleNext = useCallback(() => {
    if (step < 4) setStep((step + 1) as Step)
  }, [step])

  const handleBack = useCallback(() => {
    if (step > 1) setStep((step - 1) as Step)
    else navigation.goBack()
  }, [step, navigation])

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddress || !selectedPayment) return
    try {
      const order = await createOrder({
        addressId: selectedAddress.id,
        paymentMethodId: selectedPayment.id,
      }).unwrap()
      navigation.navigate(ROUTES.ORDER_CONFIRMATION, { orderId: order.id })
    } catch {
      setToast({ msg: t('errors.generic'), type: 'error' })
    }
  }, [selectedAddress, selectedPayment, createOrder, navigation, t])

  const styles = useMemo(() => createStyles(colors), [colors])

  const canProceed = useMemo(() => {
    if (step === 1) return !!selectedAddress
    if (step === 2) return !!selectedPayment
    return true
  }, [step, selectedAddress, selectedPayment])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('checkout.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <StepIndicator current={step} colors={colors} t={t} />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Step 1: Address */}
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.selectAddress')}</Text>
            {addresses?.map(address => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.optionCard,
                  selectedAddress?.id === address.id && styles.optionCardActive,
                ]}
                onPress={() => setSelectedAddress(address)}
                activeOpacity={0.75}
              >
                <View style={styles.optionRadio}>
                  {selectedAddress?.id === address.id && (
                    <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{address.label}</Text>
                  <Text style={styles.optionSubtitle}>
                    {address.line1}, {address.city}, {address.state}
                  </Text>
                  {address.isDefault && (
                    <Text style={[styles.defaultBadge, { color: colors.primary }]}>
                      {t('addresses.default')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.addNewBtn, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate(ROUTES.ADDRESS)}
              activeOpacity={0.75}
            >
              <Text style={[styles.addNewText, { color: colors.primary }]}>+ {t('addresses.addNew')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.selectPayment')}</Text>
            {paymentMethods?.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.optionCard,
                  selectedPayment?.id === method.id && styles.optionCardActive,
                ]}
                onPress={() => setSelectedPayment(method)}
                activeOpacity={0.75}
              >
                <View style={styles.optionRadio}>
                  {selectedPayment?.id === method.id && (
                    <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    {method.brand} ••••{method.last4}
                  </Text>
                  <Text style={styles.optionSubtitle}>{t('payment.expires')} {method.expiry}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.addNewBtn, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate(ROUTES.PAYMENT)}
              activeOpacity={0.75}
            >
              <Text style={[styles.addNewText, { color: colors.primary }]}>+ {t('payment.addMethod')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Review */}
        {step === 3 && cart && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.orderReview')}</Text>
            {cart.items.map(item => (
              <View key={item.id} style={styles.reviewItem}>
                <Text style={styles.reviewItemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.reviewItemDetail}>
                  {item.size} · {item.color} · x{item.quantity}
                </Text>
                <Text style={[styles.reviewItemPrice, { color: colors.primary }]}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
              <Text style={styles.summaryValue}>₦{cart.subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.shipping')}</Text>
              <Text style={styles.summaryValue}>₦{cart.shipping.toLocaleString()}</Text>
            </View>
            {cart.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.success }]}>{t('cart.discount')}</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>-₦{cart.discount.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { fontFamily: 'Poppins-SemiBold', color: colors.textPrimary }]}>
                {t('cart.total')}
              </Text>
              <Text style={[styles.summaryValue, { fontFamily: 'Inter-Bold', color: colors.primary, fontSize: 18 }]}>
                ₦{cart.total.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.confirmOrder')}</Text>
            <View style={[styles.confirmCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.confirmLabel}>{t('checkout.deliverTo')}</Text>
              <Text style={styles.confirmValue}>
                {selectedAddress?.line1}, {selectedAddress?.city}
              </Text>
            </View>
            <View style={[styles.confirmCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.confirmLabel}>{t('checkout.payWith')}</Text>
              <Text style={styles.confirmValue}>
                {selectedPayment?.brand} ••••{selectedPayment?.last4}
              </Text>
            </View>
            <Text style={[styles.confirmNote, { color: colors.textMuted }]}>
              {t('checkout.confirmNote')}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {step < 4 ? (
          <Button
            title={t('common.continue')}
            onPress={handleNext}
            disabled={!canProceed}
          />
        ) : (
          <Button
            title={t('checkout.placeOrder')}
            onPress={handlePlaceOrder}
            loading={isPlacing}
          />
        )}
      </View>

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
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary },
    headerTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    body: { flex: 1 },
    section: { paddingHorizontal: 20, paddingTop: 8 },
    sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary, marginBottom: 16 },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginBottom: 12,
      gap: 14,
    },
    optionCardActive: { borderColor: colors.primary, backgroundColor: 'rgba(201,168,76,0.06)' },
    optionRadio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    radioFill: { width: 10, height: 10, borderRadius: 5 },
    optionContent: { flex: 1 },
    optionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: colors.textPrimary },
    optionSubtitle: { fontFamily: 'Poppins-Regular', fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    defaultBadge: { fontFamily: 'Poppins-Medium', fontSize: 11, marginTop: 4 },
    addNewBtn: {
      borderWidth: 1.5,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 16,
    },
    addNewText: { fontFamily: 'Poppins-SemiBold', fontSize: 14 },
    reviewItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    reviewItemName: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textPrimary },
    reviewItemDetail: { fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },
    reviewItemPrice: { fontFamily: 'Inter-Bold', fontSize: 15, marginTop: 4 },
    divider: { height: 1, marginVertical: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary },
    summaryValue: { fontFamily: 'Inter-Regular', fontSize: 14, color: colors.textPrimary },
    confirmCard: { borderRadius: 12, padding: 16, marginBottom: 12 },
    confirmLabel: { fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.textMuted, marginBottom: 4 },
    confirmValue: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: colors.textPrimary },
    confirmNote: { fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 16, lineHeight: 20 },
    footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1 },
  })

export default CheckoutScreen
