import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetPaymentMethodsQuery, useDeletePaymentMethodMutation } from '@store/api/paymentsApi'
import Button from '@shared/components/Button'

const PaymentMethodsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const { data: methods } = useGetPaymentMethodsQuery()
  const [deleteMethod] = useDeletePaymentMethodMutation()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('profile.paymentMethods')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlashList
        data={methods ?? []}
        estimatedItemSize={80}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm } as any}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}>
            <Text style={{ fontSize: 28 }}>{item.type === 'card' ? '💳' : '🏦'}</Text>
            <View style={styles.cardInfo}>
              <Text style={[typography.label, { color: colors.textPrimary }]}>
                {item.type === 'card' ? `•••• ${item.last4}` : item.type}
              </Text>
              {item.expiry && <Text style={[typography.caption, { color: colors.textMuted }]}>Expires {item.expiry}</Text>}
              {item.isDefault && <Text style={[typography.caption, { color: colors.primary }]}>Default</Text>}
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Remove', 'Remove this payment method?', [
                { text: t('common.cancel'), style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => { void deleteMethod(item.id) } },
              ])}
            >
              <Text style={{ color: colors.error }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button label="Add Payment Method" onPress={() => {}} variant="primary" />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  cardInfo: { flex: 1, gap: 2 },
  footer: { padding: 24, borderTopWidth: 1 },
})

export default PaymentMethodsScreen
