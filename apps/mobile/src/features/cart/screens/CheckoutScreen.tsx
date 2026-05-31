import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetAddressesQuery } from '@store/api/userApi'
import { useGetPaymentMethodsQuery } from '@store/api/paymentsApi'
import { useCreateOrderMutation } from '@store/api/ordersApi'
import { ROUTES } from '@constants/routes'
import Button from '@shared/components/Button'

const STEPS = ['address', 'payment', 'review', 'confirm'] as const
type Step = (typeof STEPS)[number]

const CheckoutScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const [step, setStep] = useState<Step>('address')
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const { data: addresses } = useGetAddressesQuery()
  const { data: methods } = useGetPaymentMethodsQuery()
  const [createOrder, { isLoading }] = useCreateOrderMutation()

  const stepIndex = STEPS.indexOf(step)

  const handleNext = useCallback(async () => {
    if (step === 'review') {
      if (!selectedAddress || !selectedPayment) return
      const order = await createOrder({
        addressId: selectedAddress,
        paymentMethodId: selectedPayment,
      }).unwrap()
      // @ts-ignore
      navigation.replace(ROUTES.ORDER_CONFIRMATION, { orderId: order.id })
    } else {
      setStep(STEPS[stepIndex + 1])
    }
  }, [step, stepIndex, selectedAddress, selectedPayment, createOrder, navigation])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('checkout.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Stepper */}
      <View style={[styles.stepper, { paddingHorizontal: spacing.md }]}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                {
                  backgroundColor: i <= stepIndex ? colors.primary : colors.surface,
                  borderColor: i <= stepIndex ? colors.primary : colors.border,
                },
              ]}>
                <Text style={[typography.caption, { color: i <= stepIndex ? colors.textInverse : colors.textMuted }]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={[typography.caption, { color: i === stepIndex ? colors.primary : colors.textMuted }]}>
                {t(`checkout.${s}` as never)}
              </Text>
            </View>
            {i < STEPS.length - 1 && <View style={[styles.stepLine, { backgroundColor: i < stepIndex ? colors.primary : colors.border }]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {step === 'address' && (
          <View>
            <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 16 }]}>{t('checkout.selectAddress')}</Text>
            {(addresses ?? []).map(addr => (
              <TouchableOpacity
                key={addr.id}
                style={[
                  styles.addrCard,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: radius.lg,
                    borderColor: selectedAddress === addr.id ? colors.primary : colors.border,
                    borderWidth: 1.5,
                  },
                ]}
                onPress={() => setSelectedAddress(addr.id)}
              >
                <Text style={[typography.label, { color: colors.textPrimary }]}>{addr.label}</Text>
                <Text style={[typography.body2, { color: colors.textSecondary }]}>
                  {addr.line1}, {addr.city}, {addr.country}
                </Text>
                {selectedAddress === addr.id && <Text style={{ color: colors.primary }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 'payment' && (
          <View>
            <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 16 }]}>Select Payment</Text>
            {(methods ?? []).map(m => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.addrCard,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: radius.lg,
                    borderColor: selectedPayment === m.id ? colors.primary : colors.border,
                    borderWidth: 1.5,
                  },
                ]}
                onPress={() => setSelectedPayment(m.id)}
              >
                <Text style={[typography.label, { color: colors.textPrimary }]}>
                  {m.type === 'card' ? `•••• ${m.last4}` : m.type}
                </Text>
                {selectedPayment === m.id && <Text style={{ color: colors.primary }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 'review' && (
          <View>
            <Text style={[typography.h4, { color: colors.textPrimary }]}>Review & Place Order</Text>
            <Text style={[typography.body2, { color: colors.textSecondary, marginTop: 8 }]}>
              Please review your order before confirming.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button
          label={step === 'review' ? t('checkout.placeOrder') : t('common.next')}
          onPress={handleNext}
          loading={isLoading}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  stepLine: { flex: 1, height: 1.5, marginBottom: 16 },
  addrCard: { padding: 16, marginBottom: 12 },
  footer: { padding: 24, borderTopWidth: 1 },
})

export default CheckoutScreen
