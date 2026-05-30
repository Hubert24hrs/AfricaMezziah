import React, { memo, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'

interface MasonryItem {
  id: string
  imageUrl: string
  title: string
  price: number
  likeCount?: number
  tall?: boolean
}

interface MasonryGridProps {
  items: MasonryItem[]
  onPress: (id: string) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const COL_WIDTH = (SCREEN_WIDTH - 48) / 2

const MasonryGrid: React.FC<MasonryGridProps> = memo(({ items, onPress }) => {
  const { colors } = useTheme()

  const leftCol = items.filter((_, i) => i % 2 === 0)
  const rightCol = items.filter((_, i) => i % 2 !== 0)

  const renderItem = useCallback((item: MasonryItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.75}
    >
      <FastImage
        source={{ uri: item.imageUrl }}
        style={[styles.image, { height: index % 3 === 0 ? 220 : 160 }]}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.overlay}>
        {item.likeCount !== undefined && (
          <View style={[styles.likeBadge, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <Text style={styles.likeText}>❤️ {item.likeCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>₦{item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  ), [colors, onPress])

  return (
    <View style={styles.container}>
      <View style={styles.col}>{leftCol.map((item, i) => renderItem(item, i * 2))}</View>
      <View style={styles.col}>{rightCol.map((item, i) => renderItem(item, i * 2 + 1))}</View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  col: { flex: 1, gap: 12 },
  card: { borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%' },
  overlay: { position: 'absolute', top: 8, right: 8 },
  likeBadge: { borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 },
  likeText: { color: '#fff', fontFamily: 'Inter-Regular', fontSize: 11 },
  info: { padding: 8 },
  title: { fontFamily: 'Poppins-Regular', fontSize: 12, marginBottom: 2 },
  price: { fontFamily: 'Inter-Bold', fontSize: 13 },
})

export default MasonryGrid
