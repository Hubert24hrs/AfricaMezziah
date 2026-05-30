import React, { memo, useCallback, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { ROUTES } from '@shared/constants/routes'

interface SortOption {
  key: string
  labelKey: string
  icon: string
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'newest', labelKey: 'catalog.sort.newest', icon: '🆕' },
  { key: 'price_asc', labelKey: 'catalog.sort.priceLow', icon: '↑' },
  { key: 'price_desc', labelKey: 'catalog.sort.priceHigh', icon: '↓' },
  { key: 'best_selling', labelKey: 'catalog.sort.bestSelling', icon: '🔥' },
  { key: 'top_rated', labelKey: 'catalog.sort.topRated', icon: '⭐' },
  { key: 'most_popular', labelKey: 'catalog.sort.mostPopular', icon: '📈' },
]

/** Sort modal — 6 options with radio indicator, gold checkmark on selected */
const SortScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const initialSort: string = route.params?.currentSort ?? 'newest'
  const [selected, setSelected] = useState(initialSort)

  const handleSelect = useCallback(
    (key: string) => {
      setSelected(key)
      // Return selection to previous screen via navigation params
      navigation.navigate(ROUTES.PRODUCT_LIST, {
        ...route.params,
        sort: key,
      })
    },
    [navigation, route.params],
  )

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('catalog.sortBy')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {SORT_OPTIONS.map(option => {
        const isSelected = selected === option.key
        return (
          <TouchableOpacity
            key={option.key}
            style={[styles.row, isSelected && styles.rowActive]}
            onPress={() => handleSelect(option.key)}
            activeOpacity={0.75}
          >
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={[styles.label, { color: isSelected ? colors.primary : colors.textPrimary }]}>
              {t(option.labelKey)}
            </Text>
            <View
              style={[
                styles.radio,
                isSelected
                  ? { borderColor: colors.primary, backgroundColor: colors.primary }
                  : { borderColor: colors.border },
              ]}
            >
              {isSelected && <Text style={styles.radioCheck}>✓</Text>}
            </View>
          </TouchableOpacity>
        )
      })}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginTop: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    closeText: { fontFamily: 'Poppins-Regular', fontSize: 18, color: colors.textSecondary },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 16,
    },
    rowActive: { backgroundColor: 'rgba(201,168,76,0.06)' },
    icon: { fontSize: 20, width: 28, textAlign: 'center' },
    label: { flex: 1, fontFamily: 'Poppins-Medium', fontSize: 16 },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioCheck: { color: '#fff', fontSize: 12, fontWeight: '700' },
  })

export default SortScreen
