import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { LinearGradient } from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shared/hooks/useTheme'
import { ROUTES } from '@constants/routes'
import type { Product } from '@features/catalog/catalog.types'

const { width } = Dimensions.get('window')
const COL_WIDTH = (width - 48) / 2

interface MasonryGridProps {
  products: Product[]
}

const MasonryGrid: React.FC<MasonryGridProps> = memo(({ products }) => {
  const { colors, typography, radius } = useTheme()
  const navigation = useNavigation()

  const leftCol = products.filter((_, i) => i % 2 === 0)
  const rightCol = products.filter((_, i) => i % 2 !== 0)

  const renderItem = useCallback(
    (item: Product, index: number) => {
      const height = index % 3 === 0 ? 260 : 180
      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.item, { borderRadius: radius.lg, overflow: 'hidden', marginBottom: 8 }]}
          onPress={() => {
            // @ts-ignore
            navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })
          }}
          activeOpacity={0.9}
        >
          <FastImage
            source={{ uri: item.imageUrl, priority: FastImage.priority.normal }}
            style={{ width: COL_WIDTH, height }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
            <Text style={[typography.caption, { color: '#FFFFFF' }]}>{item.likeCount ?? 0} ♥</Text>
          </LinearGradient>
        </TouchableOpacity>
      )
    },
    [navigation, radius, typography],
  )

  return (
    <View style={[styles.container, { paddingHorizontal: 16 }]}>
      <View style={styles.col}>{leftCol.map((item, i) => renderItem(item, i * 2))}</View>
      <View style={[styles.col, { marginTop: 40 }]}>{rightCol.map((item, i) => renderItem(item, i * 2 + 1))}</View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  item: { position: 'relative' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
})

export default MasonryGrid
