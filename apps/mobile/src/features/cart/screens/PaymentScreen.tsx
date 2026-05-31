import React, { memo, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { enableScreenshotPrevention, disableScreenshotPrevention } from '@services/securityService'
import { useGetPaymentMethodsQuery } from '@store/api/paymentsApi'
import Button from '@shared/components/Button'

const PaymentScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const { data: methods } = useGetPaymentMethodsQuery()

  useEffect(() => {
    void enableScreenshotPrevention()
    return () => { void disableScreenshotPrevention() }
  }, [])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('profile.paymentMethods')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ padding: spacing.md, gap: 16 }}>
        <View style={[styles.secureNote, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('checkout.securePayment')}</Text>
        </View>

        {(methods ?? []).map(m => (
          <View
            key={m.id}
            style={[styles.method, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}
          >
            <Text style={[typography.label, { color: colors.textPrimary }]}>
              {m.type === 'card' ? `💳 •••• ${m.last4}` : `🏦 ${m.type}`}
            </Text>
            {m.isDefault && <Text style={[typography.caption, { color: colors.primary }]}>Default</Text>}
          </View>
        ))}

        <Button label="Add New Payment Method" onPress={() => {}} variant="secondary" />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  lockIcon: { fontSize: 16 },
  method: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
})

export default PaymentScreen
