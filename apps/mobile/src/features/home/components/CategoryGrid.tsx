import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { ROUTES } from '@constants/routes'

interface Category {
  id: string
  name: string
  imageUrl: string
  i18nKey: string
}

const CATEGORIES: Category[] = [
  { id: 'women', name: 'Women', imageUrl: 'https://placeholder.com/women', i18nKey: 'catalog.women' },
  { id: 'men', name: 'Men', imageUrl: 'https://placeholder.com/men', i18nKey: 'catalog.men' },
  { id: 'children', name: 'Children', imageUrl: 'https://placeholder.com/children', i18nKey: 'catalog.children' },
  { id: 'shoes', name: 'Shoes', imageUrl: 'https://placeholder.com/shoes', i18nKey: 'catalog.shoes' },
  { id: 'bags', name: 'Bags', imageUrl: 'https://placeholder.com/bags', i18nKey: 'catalog.bags' },
  { id: 'accessories', name: 'Accessories', imageUrl: 'https://placeholder.com/accessories', i18nKey: 'catalog.accessories' },
  { id: 'ankara', name: 'Ankara', imageUrl: 'https://placeholder.com/ankara', i18nKey: 'catalog.ankara' },
  { id: 'formal', name: 'Formal', imageUrl: 'https://placeholder.com/formal', i18nKey: 'catalog.formal' },
  { id: 'sportswear', name: 'Sportswear', imageUrl: 'https://placeholder.com/sportswear', i18nKey: 'catalog.sportswear' },
  { id: 'swimwear', name: 'Swimwear', imageUrl: 'https://placeholder.com/swimwear', i18nKey: 'catalog.swimwear' },
]

interface CategoryGridProps {
  onCategoryPress?: (id: string) => void
}

const CategoryGrid: React.FC<CategoryGridProps> = memo(({ onCategoryPress }) => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()

  const handlePress = useCallback(
    (id: string) => {
      if (onCategoryPress) {
        onCategoryPress(id)
      } else {
        // @ts-ignore navigation typing
        navigation.navigate(ROUTES.PRODUCT_LIST, { categoryId: id })
      }
    },
    [onCategoryPress, navigation],
  )

  return (
    <FlatList
      data={CATEGORIES}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.md }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => handlePress(item.id)}
          activeOpacity={0.75}
        >
          <View style={[styles.circle, { borderColor: colors.primary }]}>
            <FastImage
              source={{ uri: item.imageUrl, priority: FastImage.priority.normal }}
              style={styles.circleImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: 6 }]} numberOfLines={1}>
            {t(item.i18nKey as never)}
          </Text>
        </TouchableOpacity>
      )}
    />
  )
})

const styles = StyleSheet.create({
  item: { alignItems: 'center', width: 72 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    overflow: 'hidden',
  },
  circleImage: { width: '100%', height: '100%' },
})

export default CategoryGrid
