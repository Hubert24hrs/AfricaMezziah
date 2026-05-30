import React, { memo, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'
import type { Product } from '@store/api/productsApi'

interface MasonryGridProps {
  title: string
  products: Product[]
  onProductPress: (id: string) => void
}

const MasonryGrid: React.FC<MasonryGridProps> = memo(({ title, products, onProductPress }) => {
  const { colors } = useTheme()

  const leftCol = products.filter((_, i) => i % 2 === 0)
  const rightCol = products.filter((_, i) => i % 2 !== 0)

  const renderItem = useCallback((item: Product, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => onProductPress(item.id)}
      activeOpacity={0.75}
    >
      <FastImage
        source={{ uri: item.images?.[0] }}
        style={[styles.image, { height: index % 3 === 0 ? 220 : 160 }]}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          {item.currency ?? '₦'}{item.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  ), [colors, onProductPress])

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>{title}</Text>
      <View style={styles.container}>
        <View style={styles.col}>{leftCol.map((item, i) => renderItem(item, i * 2))}</View>
        <View style={styles.col}>{rightCol.map((item, i) => renderItem(item, i * 2 + 1))}</View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  heading: { fontFamily: 'Poppins-SemiBold', fontSize: 17, paddingHorizontal: 16, marginBottom: 12 },
  container: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  col: { flex: 1, gap: 12 },
  card: { borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%' },
  info: { padding: 8 },
  name: { fontFamily: 'Poppins-Regular', fontSize: 12, marginBottom: 2 },
  price: { fontFamily: 'Inter-Bold', fontSize: 13 },
})

export default MasonryGrid
