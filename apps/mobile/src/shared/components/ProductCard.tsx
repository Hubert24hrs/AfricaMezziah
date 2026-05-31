import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppDispatch } from '@store/store'
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@store/api/userApi'
import { formatCurrency, formatDiscount } from '@shared/utils/formatCurrency'
import Badge from './Badge'
import Skeleton from './Skeleton'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  imageUrl: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isHot?: boolean
  isFlashSale?: boolean
  isOutOfStock?: boolean
  isWishlisted?: boolean
  currency?: string
  onPress: () => void
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  id,
  title,
  price,
  originalPrice,
  imageUrl,
  rating = 0,
  reviewCount = 0,
  isNew,
  isHot,
  isFlashSale,
  isOutOfStock,
  isWishlisted = false,
  currency = 'NGN',
  onPress,
}) => {
  const { colors, typography, radius, shadows } = useTheme()
  const [addToWishlist] = useAddToWishlistMutation()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const heartScale = useSharedValue(1)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }))

  const handleWishlist = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    heartScale.value = withSpring(1.4, { damping: 5 }, () => {
      heartScale.value = withSpring(1)
    })
    if (isWishlisted) {
      await removeFromWishlist(id)
    } else {
      await addToWishlist(id)
    }
  }, [id, isWishlisted, addToWishlist, removeFromWishlist, heartScale])

  const discount = originalPrice ? formatDiscount(originalPrice, price) : 0

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {!imageLoaded && <Skeleton height={CARD_WIDTH * 1.2} borderRadius={0} />}
        <FastImage
          source={{ uri: imageUrl, priority: FastImage.priority.normal }}
          style={[styles.image, { opacity: imageLoaded ? 1 : 0 }]}
          resizeMode={FastImage.resizeMode.cover}
          onLoad={() => setImageLoaded(true)}
        />

        <View style={styles.badges}>
          {isFlashSale && <Badge variant="flashSale" />}
          {isNew && !isFlashSale && <Badge variant="new" />}
          {isHot && !isFlashSale && !isNew && <Badge variant="hot" />}
          {discount > 0 && !isFlashSale && <Badge variant="discount" percent={discount} />}
        </View>

        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Badge variant="outOfStock" />
          </View>
        )}

        <Animated.View style={[styles.wishlistBtn, heartStyle]}>
          <TouchableOpacity onPress={() => { void handleWishlist() }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.heart, { color: isWishlisted ? colors.accent : 'rgba(255,255,255,0.7)' }]}>
              {isWishlisted ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Text style={[typography.body2, { color: colors.textPrimary }]} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[typography.price, { color: colors.primary }]}>{formatCurrency(price, currency)}</Text>
          {originalPrice && originalPrice > price && (
            <Text style={[typography.caption, { color: colors.textMuted, textDecorationLine: 'line-through' }]}>
              {formatCurrency(originalPrice, currency)}
            </Text>
          )}
        </View>

        {rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}> ({reviewCount})</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, margin: 6, overflow: 'hidden' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: CARD_WIDTH * 1.2 },
  badges: { position: 'absolute', top: 8, left: 8, gap: 4 },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistBtn: { position: 'absolute', top: 8, right: 8 },
  heart: { fontSize: 22 },
  content: { padding: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stars: { color: '#FFB830', fontSize: 12 },
})

export default ProductCard
