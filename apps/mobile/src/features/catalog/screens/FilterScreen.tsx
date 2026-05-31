import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import Button from '@shared/components/Button'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#E94560' },
  { name: 'Gold', hex: '#C9A84C' },
  { name: 'Navy', hex: '#1A1A2E' },
  { name: 'Green', hex: '#00C896' },
]
const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'popular', label: 'Most Popular' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'discount', label: 'Biggest Discount' },
]

const FilterScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()

  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100000)
  const [minRating, setMinRating] = useState(0)
  const [selectedSort, setSelectedSort] = useState('newest')
  const [inStock, setInStock] = useState(false)

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }, [])

  const toggleColor = useCallback((color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])
  }, [])

  const handleApply = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleReset = useCallback(() => {
    setSelectedSizes([])
    setSelectedColors([])
    setMinPrice(0)
    setMaxPrice(100000)
    setMinRating(0)
    setSelectedSort('newest')
    setInStock(false)
  }, [])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('common.filter')}</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={[typography.label, { color: colors.accent }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.lg }}>
        {/* Sort */}
        <View>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>{t('common.sort')}</Text>
          <View style={styles.chips}>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.chip,
                  {
                    borderColor: selectedSort === opt.key ? colors.primary : colors.border,
                    backgroundColor: selectedSort === opt.key ? `${colors.primary}22` : colors.surface,
                    borderRadius: radius.full,
                  },
                ]}
                onPress={() => setSelectedSort(opt.key)}
              >
                <Text style={[typography.caption, { color: selectedSort === opt.key ? colors.primary : colors.textSecondary }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sizes */}
        <View>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>Size</Text>
          <View style={styles.chips}>
            {SIZES.map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeChip,
                  {
                    borderColor: selectedSizes.includes(size) ? colors.primary : colors.border,
                    backgroundColor: selectedSizes.includes(size) ? colors.primary : colors.surface,
                    borderRadius: radius.md,
                  },
                ]}
                onPress={() => toggleSize(size)}
              >
                <Text style={[typography.label, { color: selectedSizes.includes(size) ? colors.textInverse : colors.textSecondary }]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Colors */}
        <View>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>Colour</Text>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c.name}
                style={[
                  styles.colorDot,
                  { backgroundColor: c.hex, borderColor: selectedColors.includes(c.name) ? colors.primary : 'transparent' },
                ]}
                onPress={() => toggleColor(c.name)}
              />
            ))}
          </View>
        </View>

        {/* Rating */}
        <View>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>Min Rating</Text>
          <View style={styles.chips}>
            {[4, 3, 2, 1].map(r => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.chip,
                  {
                    borderColor: minRating === r ? colors.primary : colors.border,
                    backgroundColor: minRating === r ? `${colors.primary}22` : colors.surface,
                    borderRadius: radius.full,
                  },
                ]}
                onPress={() => setMinRating(r)}
              >
                <Text style={[typography.caption, { color: minRating === r ? colors.primary : colors.textSecondary }]}>
                  {'★'.repeat(r)} & up
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* In Stock */}
        <View style={styles.switchRow}>
          <Text style={[typography.body1, { color: colors.textPrimary }]}>In Stock Only</Text>
          <Switch value={inStock} onValueChange={setInStock} trackColor={{ true: colors.primary, false: colors.border }} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button label={`Apply Filters`} onPress={handleApply} variant="primary" />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
  sizeChip: { width: 52, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footer: { padding: 24, borderTopWidth: 1 },
})

export default FilterScreen
