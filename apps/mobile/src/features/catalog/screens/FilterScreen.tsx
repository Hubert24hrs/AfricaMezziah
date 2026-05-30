import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import Slider from '@miblanchard/react-native-slider'
import { useTheme } from '@shared/hooks/useTheme'
import Button from '@shared/components/Button'
import { ROUTES } from '@shared/constants/routes'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gold', hex: '#C9A84C' },
  { name: 'Red', hex: '#E94560' },
  { name: 'Navy', hex: '#1A1A2E' },
  { name: 'Green', hex: '#00C896' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Blue', hex: '#0EA5E9' },
]
const BRANDS = ['Ankara House', 'Afro Luxe', 'Kente Couture', 'Nuba Styles', 'Zulu Chic']
const RATINGS = [4, 3, 2, 1]

interface FilterState {
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  brands: string[]
  minRating: number
}

/** Filter screen — price slider, size chips, color swatches, brand checkboxes, rating picker */
const FilterScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const existingFilters: Partial<FilterState> = route.params?.filters ?? {}

  const [filters, setFilters] = useState<FilterState>({
    priceRange: existingFilters.priceRange ?? [0, 50000],
    sizes: existingFilters.sizes ?? [],
    colors: existingFilters.colors ?? [],
    brands: existingFilters.brands ?? [],
    minRating: existingFilters.minRating ?? 0,
  })

  const toggleItem = useCallback(
    <K extends 'sizes' | 'colors' | 'brands'>(key: K, value: string) => {
      setFilters(prev => ({
        ...prev,
        [key]: prev[key].includes(value)
          ? prev[key].filter(v => v !== value)
          : [...prev[key], value],
      }))
    },
    [],
  )

  const handleApply = useCallback(() => {
    navigation.navigate(ROUTES.PRODUCT_LIST, { filters })
  }, [navigation, filters])

  const handleReset = useCallback(() => {
    setFilters({
      priceRange: [0, 50000],
      sizes: [],
      colors: [],
      brands: [],
      minRating: 0,
    })
  }, [])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('catalog.filters')}</Text>
        <TouchableOpacity onPress={handleReset} activeOpacity={0.75}>
          <Text style={styles.resetText}>{t('catalog.reset')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.priceRange')}</Text>
          <View style={styles.priceLabels}>
            <Text style={styles.priceLabel}>₦{filters.priceRange[0].toLocaleString()}</Text>
            <Text style={styles.priceLabel}>₦{filters.priceRange[1].toLocaleString()}</Text>
          </View>
          <Slider
            value={filters.priceRange}
            onValueChange={(v: number | number[]) => {
              if (Array.isArray(v)) setFilters(p => ({ ...p, priceRange: [v[0], v[1]] }))
            }}
            minimumValue={0}
            maximumValue={500000}
            step={1000}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
            containerStyle={styles.sliderContainer}
          />
        </View>

        {/* Sizes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.size')}</Text>
          <View style={styles.chipRow}>
            {SIZES.map(size => {
              const active = filters.sizes.includes(size)
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.chip,
                    active
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: 'transparent', borderColor: colors.border },
                  ]}
                  onPress={() => toggleItem('sizes', size)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? colors.textInverse : colors.textPrimary },
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.color')}</Text>
          <View style={styles.colorRow}>
            {COLORS.map(color => {
              const active = filters.colors.includes(color.name)
              return (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color.hex },
                    active && styles.colorSwatchActive,
                  ]}
                  onPress={() => toggleItem('colors', color.name)}
                  activeOpacity={0.75}
                >
                  {active && (
                    <Text style={styles.colorCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Brands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.brand')}</Text>
          {BRANDS.map(brand => {
            const active = filters.brands.includes(brand)
            return (
              <TouchableOpacity
                key={brand}
                style={styles.checkRow}
                onPress={() => toggleItem('brands', brand)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.checkbox,
                    active && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                >
                  {active && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.checkLabel, { color: colors.textPrimary }]}>{brand}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.minRating')}</Text>
          <View style={styles.chipRow}>
            {RATINGS.map(r => {
              const active = filters.minRating === r
              return (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.chip,
                    active
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: 'transparent', borderColor: colors.border },
                  ]}
                  onPress={() => setFilters(p => ({ ...p, minRating: r }))}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? colors.textInverse : colors.textPrimary },
                    ]}
                  >
                    {'★'.repeat(r)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t('catalog.applyFilters')} onPress={handleApply} />
      </View>
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
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeText: { fontFamily: 'Poppins-Regular', fontSize: 18, color: colors.textSecondary },
    headerTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    resetText: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.primary },
    body: { flex: 1, paddingHorizontal: 20 },
    section: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
    sectionTitle: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 16,
    },
    priceLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    priceLabel: { fontFamily: 'Inter-Bold', fontSize: 14, color: colors.primary },
    sliderContainer: { marginTop: 8 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1.5,
    },
    chipText: { fontFamily: 'Poppins-Medium', fontSize: 13 },
    colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    colorSwatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorSwatchActive: { borderColor: colors.primary, transform: [{ scale: 1.1 }] },
    colorCheck: { color: '#fff', fontSize: 14, fontWeight: '700', textShadowColor: '#000', textShadowRadius: 2 },
    checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 14 },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkMark: { color: colors.textInverse, fontSize: 13, fontWeight: '700' },
    checkLabel: { fontFamily: 'Poppins-Regular', fontSize: 15 },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  })

export default FilterScreen
