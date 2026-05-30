import React, { memo, useCallback } from 'react'
import { Text, TouchableOpacity, StyleSheet, ScrollView, View } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'

interface CategoryGridProps {
  onCategoryPress: (categoryId: string) => void
}

interface CategoryItem {
  id: string
  name: string
  emoji: string
}

// Static top-level category shortcuts (per design.md CategoryGrid spec).
const CATEGORIES: CategoryItem[] = [
  { id: 'women', name: 'Women', emoji: '👗' },
  { id: 'men', name: 'Men', emoji: '👔' },
  { id: 'children', name: 'Children', emoji: '🧒' },
  { id: 'shoes', name: 'Shoes', emoji: '👠' },
  { id: 'bags', name: 'Bags', emoji: '👜' },
  { id: 'accessories', name: 'Accessories', emoji: '💍' },
  { id: 'ankara', name: 'Ankara', emoji: '🪡' },
  { id: 'formal', name: 'Formal', emoji: '🤵' },
  { id: 'sportswear', name: 'Sportswear', emoji: '🏃' },
  { id: 'swimwear', name: 'Swimwear', emoji: '🩱' },
]

const CategoryGrid: React.FC<CategoryGridProps> = memo(({ onCategoryPress }) => {
  const { colors } = useTheme()

  const renderItem = useCallback((cat: CategoryItem) => (
    <TouchableOpacity key={cat.id} style={styles.item} onPress={() => onCategoryPress(cat.id)} activeOpacity={0.75}>
      <View style={[styles.circle, { borderColor: colors.primary, backgroundColor: colors.surface }]}>
        <Text style={styles.emoji}>{cat.emoji}</Text>
      </View>
      <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={1}>{cat.name}</Text>
    </TouchableOpacity>
  ), [colors, onCategoryPress])

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {CATEGORIES.map(renderItem)}
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 16, gap: 16 },
  item: { alignItems: 'center', width: 72 },
  circle: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, overflow: 'hidden', marginBottom: 6, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28 },
  label: { fontFamily: 'Poppins-Regular', fontSize: 11, textAlign: 'center' },
})

export default CategoryGrid
