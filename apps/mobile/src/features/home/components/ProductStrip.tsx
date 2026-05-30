import React, { memo, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'
import ProductCard from '@shared/components/ProductCard'

interface StripProduct {
  id: string
  title: string
  price: number
  originalPrice?: number
  imageUrl: string
  rating?: number
  reviewCount?: number
  discountPercent?: number
  isNew?: boolean
}

interface ProductStripProps {
  title: string
  products: StripProduct[]
  onProductPress: (id: string) => void
  onSeeAll?: () => void
  badgeType?: 'ai' | 'new'
}

const ProductStrip: React.FC<ProductStripProps> = memo(({ title, products, onProductPress, onSeeAll, badgeType }) => {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {badgeType === 'ai' && <Text style={styles.sparkle}>✨ </Text>}
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        </View>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.75}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {products.map(p => (
          <View key={p.id} style={styles.cardWrap}>
            <ProductCard
              id={p.id}
              title={p.title}
              price={p.price}
              originalPrice={p.originalPrice}
              imageUrl={p.imageUrl}
              rating={p.rating}
              reviewCount={p.reviewCount}
              discountPercent={p.discountPercent}
              isNew={p.isNew}
              onPress={() => onProductPress(p.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 17 },
  sparkle: { fontSize: 17 },
  seeAll: { fontFamily: 'Poppins-Medium', fontSize: 13 },
  list: { paddingHorizontal: 16, gap: 12 },
  cardWrap: { width: 160 },
})

export default ProductStrip
