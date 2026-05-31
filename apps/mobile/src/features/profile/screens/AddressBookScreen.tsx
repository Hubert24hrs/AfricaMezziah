import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetAddressesQuery, useDeleteAddressMutation } from '@store/api/userApi'
import { ROUTES } from '@constants/routes'
import EmptyState from '@shared/components/EmptyState'
import Button from '@shared/components/Button'
import type { Address } from '../profile.types'

const AddressBookScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const { data: addresses } = useGetAddressesQuery()
  const [deleteAddress] = useDeleteAddressMutation()

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Address', 'Remove this address?', [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => { void deleteAddress(id) } },
      ])
    },
    [deleteAddress, t],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('settings.addressBook')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {(addresses ?? []).length === 0 ? (
        <EmptyState emoji="📍" title="No addresses saved" subtitle="Add an address for faster checkout" />
      ) : (
        <FlashList
          data={addresses ?? []}
          estimatedItemSize={100}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm } as any}
          renderItem={({ item }: { item: Address }) => (
            <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}>
              <View style={styles.cardContent}>
                <View style={styles.labelRow}>
                  <Text style={[typography.label, { color: colors.textPrimary }]}>{item.label}</Text>
                  {item.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: `${colors.primary}22`, borderColor: colors.primary }]}>
                      <Text style={[typography.overline, { color: colors.primary }]}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <Text style={[typography.body2, { color: colors.textSecondary }]}>
                  {item.line1}{item.line2 ? `, ${item.line2}` : ''}
                </Text>
                <Text style={[typography.body2, { color: colors.textSecondary }]}>
                  {item.city}, {item.state}, {item.country} {item.postalCode}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text style={{ color: colors.error, fontSize: 18 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {/* @ts-ignore */}
        <Button label={t('settings.addAddress')} onPress={() => navigation.navigate(ROUTES.ADDRESS)} variant="primary" />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  card: { flexDirection: 'row', padding: 16 },
  cardContent: { flex: 1, gap: 4 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  deleteBtn: { padding: 4 },
  footer: { padding: 24, borderTopWidth: 1 },
})

export default AddressBookScreen
