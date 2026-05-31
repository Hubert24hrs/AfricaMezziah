import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import ProductCard from '@shared/components/ProductCard'
import { ROUTES } from '@constants/routes'
import type { Product } from '@features/catalog/catalog.types'

interface ProductStripProps {
  title: string
  products: Product[]
  seeAllRoute?: string
  badgeType?: 'new' | 'hot' | 'none'
}

const ProductStrip: React.FC<ProductStripProps> = memo(({ title, products, seeAllRoute, badgeType = 'none' }) => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()

  const handlePress = useCallback(
    (id: string) => {
      // @ts-ignore
      navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: id })
    },
    [navigation],
  )

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{title}</Text>
        {seeAllRoute && (
          <TouchableOpacity>
            <Text style={[typography.label, { color: colors.primary }]}>{t('common.seeAll')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm }}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            title={item.title}
            price={item.price}
            originalPrice={item.originalPrice}
            imageUrl={item.imageUrl}
            rating={item.rating}
            reviewCount={item.reviewCount}
            isNew={badgeType === 'new'}
            isHot={badgeType === 'hot'}
            onPress={() => handlePress(item.id)}
          />
        )}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
})

export default ProductStrip
