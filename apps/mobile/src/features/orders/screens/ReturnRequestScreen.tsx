import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useCreateReturnRequestMutation } from '@store/api/ordersApi'
import Button from '@shared/components/Button'

const REASONS = ['Wrong size', 'Defective item', 'Not as described', 'Changed my mind', 'Damaged in transit', 'Other']

const ReturnRequestScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { orderId } = route.params ?? {}
  const [reason, setReason] = useState<string | null>(null)
  const [createReturn, { isLoading }] = useCreateReturnRequestMutation()

  const handleSubmit = useCallback(async () => {
    if (!reason) {
      Alert.alert('Select Reason', 'Please select a reason for return')
      return
    }
    await createReturn({ orderId, items: [], reason, description: reason })
    navigation.goBack()
  }, [reason, orderId, createReturn, navigation])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('orders.returnRequest')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>Reason for Return</Text>
        {REASONS.map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles.option,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                borderColor: reason === r ? colors.primary : colors.border,
                borderWidth: 1.5,
              },
            ]}
            onPress={() => setReason(r)}
          >
            <Text style={[typography.body1, { color: colors.textPrimary }]}>{r}</Text>
            {reason === r && <Text style={{ color: colors.primary }}>✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button label="Submit Return Request" onPress={handleSubmit} loading={isLoading} variant="primary" />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  footer: { padding: 24, borderTopWidth: 1 },
})

export default ReturnRequestScreen
