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
import { useGetAddressesQuery, useDeleteAddressMutation, Address } from '@store/api/userApi'
import EmptyState from '@shared/components/EmptyState'
import Toast from '@shared/components/Toast'
import { useState } from 'react'
import { ROUTES } from '@shared/constants/routes'

interface AddressCardProps {
  address: Address
  onEdit: (address: Address) => void
  onDelete: (id: string) => void
  colors: ReturnType<typeof useTheme>['colors']
  t: (key: string) => string
}

const AddressCard: React.FC<AddressCardProps> = memo(({ address, onEdit, onDelete, colors, t }) => {
  const handleEdit = useCallback(() => onEdit(address), [address, onEdit])
  const handleDelete = useCallback(() => onDelete(address.id), [address.id, onDelete])

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>{address.label}</Text>
          {address.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: 'rgba(201,168,76,0.15)', borderColor: colors.primary }]}>
              <Text style={[styles.defaultText, { color: colors.primary }]}>{t('addresses.default')}</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleEdit} activeOpacity={0.75} style={styles.actionBtn}>
            <Text style={[styles.editText, { color: colors.primary }]}>{t('common.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} activeOpacity={0.75} style={styles.actionBtn}>
            <Text style={[styles.deleteText, { color: colors.error }]}>{t('common.delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.addressText, { color: colors.textSecondary }]}>
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
      </Text>
      <Text style={[styles.addressText, { color: colors.textSecondary }]}>
        {address.city}, {address.state}, {address.country} {address.postalCode}
      </Text>
    </View>
  )
})

/** Address book with edit/delete per row and FAB to add new */
const AddressBookScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data: addresses, isLoading } = useGetAddressesQuery()
  const [deleteAddress] = useDeleteAddressMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const handleEdit = useCallback(
    (address: Address) => navigation.navigate(ROUTES.ADDRESS, { address }),
    [navigation],
  )

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t('addresses.confirmDelete'), '', [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(id).unwrap()
              setToast({ msg: t('addresses.deleted'), type: 'success' })
            } catch {
              setToast({ msg: t('errors.generic'), type: 'error' })
            }
          },
        },
      ])
    },
    [deleteAddress, t],
  )

  const keyExtractor = useCallback((item: Address) => item.id, [])
  const renderItem = useCallback(
    ({ item }: { item: Address }) => (
      <AddressCard address={item} onEdit={handleEdit} onDelete={handleDelete} colors={colors} t={t} />
    ),
    [handleEdit, handleDelete, colors, t],
  )

  const sheetStyles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={sheetStyles.container}>
      <View style={sheetStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={sheetStyles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={sheetStyles.headerTitle}>{t('addresses.addressBook')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlashList
          data={addresses ?? []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={120}
          contentContainerStyle={sheetStyles.listContent}
          ListEmptyComponent={
            <EmptyState
              title={t('addresses.empty')}
              description={t('addresses.emptyDesc')}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[sheetStyles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate(ROUTES.ADDRESS)}
        activeOpacity={0.85}
      >
        <Text style={sheetStyles.fabIcon}>+</Text>
      </TouchableOpacity>

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  label: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  defaultText: { fontFamily: 'Poppins-Medium', fontSize: 10 },
  actions: { flexDirection: 'row', gap: 4 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  editText: { fontFamily: 'Poppins-Medium', fontSize: 13 },
  deleteText: { fontFamily: 'Poppins-Medium', fontSize: 13 },
  addressText: { fontFamily: 'Poppins-Regular', fontSize: 13, lineHeight: 20 },
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
    listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
    fab: {
      position: 'absolute',
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#C9A84C',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
    },
    fabIcon: { fontSize: 28, color: '#0F0F1A', fontWeight: '700', lineHeight: 32 },
  })

export default AddressBookScreen
