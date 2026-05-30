import React, { memo, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'

interface Category {
  id: string
  name: string
  imageUrl: string
  emoji?: string
}

interface CategoryGridProps {
  categories: Category[]
  onPress: (category: Category) => void
}

const CategoryGrid: React.FC<CategoryGridProps> = memo(({ categories, onPress }) => {
  const { colors } = useTheme()

  const renderItem = useCallback((cat: Category) => (
    <TouchableOpacity key={cat.id} style={styles.item} onPress={() => onPress(cat)} activeOpacity={0.75}>
      <View style={[styles.circle, { borderColor: colors.primary }]}>
        {cat.imageUrl ? (
          <FastImage source={{ uri: cat.imageUrl }} style={styles.circleImage} resizeMode={FastImage.resizeMode.cover} />
        ) : (
          <Text style={styles.emoji}>{cat.emoji ?? '👗'}</Text>
        )}
      </View>
      <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={1}>{cat.name}</Text>
    </TouchableOpacity>
  ), [colors, onPress])

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map(renderItem)}
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, gap: 16 },
  item: { alignItems: 'center', width: 72 },
  circle: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, overflow: 'hidden', marginBottom: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#16213E' },
  circleImage: { width: 64, height: 64 },
  emoji: { fontSize: 28 },
  label: { fontFamily: 'Poppins-Regular', fontSize: 11, textAlign: 'center' },
})

export default CategoryGrid
