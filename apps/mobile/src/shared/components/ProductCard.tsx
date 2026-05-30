import React, { memo, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  currency?: string
  imageUrl: string
  rating?: number
  reviewCount?: number
  discountPercent?: number
  isNew?: boolean
  isHot?: boolean
  inWishlist?: boolean
  onPress: () => void
  onWishlistToggle?: () => void
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  title, price, originalPrice, currency = '₦', imageUrl, rating = 0, reviewCount = 0,
  discountPercent, isNew, isHot, inWishlist = false, onPress, onWishlistToggle,
}) => {
  const { colors } = useTheme()

  const handleWishlist = useCallback((e: any) => {
    e.stopPropagation()
    onWishlistToggle?.()
  }, [onWishlistToggle])

  const formatPrice = (n: number) => `${currency}${n.toLocaleString()}`

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.imageContainer}>
        <FastImage
          source={{ uri: imageUrl, priority: FastImage.priority.normal }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        {discountPercent ? (
          <View style={[styles.badge, { backgroundColor: colors.accent }]}>
            <Text style={styles.badgeText}>-{discountPercent}%</Text>
          </View>
        ) : isNew ? (
          <View style={[styles.badge, { backgroundColor: colors.success }]}>
            <Text style={styles.badgeText}>New</Text>
          </View>
        ) : isHot ? (
          <View style={[styles.badge, { backgroundColor: '#FFB830' }]}>
            <Text style={styles.badgeText}>🔥 Hot</Text>
          </View>
        ) : null}
        <TouchableOpacity style={styles.wishlistBtn} onPress={handleWishlist} activeOpacity={0.75}>
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={20}
            color={inWishlist ? colors.accent : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{title}</Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>{formatPrice(price)}</Text>
          {originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>{formatPrice(originalPrice)}</Text>
          )}
        </View>
        {rating > 0 && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {rating.toFixed(1)} ({reviewCount})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  card: { borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  imageContainer: { position: 'relative' },
  image: { width: '100%', aspectRatio: 0.8 },
  badge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontFamily: 'Inter-Bold', fontSize: 10 },
  wishlistBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 4 },
  info: { padding: 10 },
  title: { fontFamily: 'Poppins-Regular', fontSize: 13, lineHeight: 18, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  price: { fontFamily: 'Inter-Bold', fontSize: 15 },
  originalPrice: { fontFamily: 'Inter-Regular', fontSize: 12, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontFamily: 'Inter-Regular', fontSize: 11 },
})

export default ProductCard
