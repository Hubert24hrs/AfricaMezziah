import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'
import { LinearGradient } from 'react-native-linear-gradient'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProductByIdQuery } from '@store/api/productsApi'
import { useAddToCartMutation } from '@store/api/cartApi'
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@store/api/userApi'
import { ROUTES } from '@constants/routes'
import Button from '@shared/components/Button'
import Badge from '@shared/components/Badge'
import { ProductCardSkeleton } from '@shared/components/Skeleton'
import { formatCurrency } from '@shared/utils/formatCurrency'

const { width } = Dimensions.get('window')

const ProductDetailScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { productId } = route.params ?? {}

  const { data: product, isLoading } = useGetProductByIdQuery(productId as string)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()
  const [addToWishlist] = useAddToWishlistMutation()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = useCallback(async () => {
    if (!selectedSize && product?.variants?.some(v => v.size)) {
      Alert.alert('Select Size', t('product.selectSize'))
      return
    }
    const variant = product?.variants?.find(v => v.size === selectedSize) ?? product?.variants?.[0]
    if (!variant || !product) return

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    await addToCart({ productId: product.id, variantId: variant.id, quantity: 1 })
  }, [product, selectedSize, addToCart, t])

  const handleWishlist = useCallback(async () => {
    if (!product) return
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (isWishlisted) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
    setIsWishlisted(prev => !prev)
  }, [product, isWishlisted, addToWishlist, removeFromWishlist])

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ProductCardSkeleton />
      </View>
    )
  }

  if (!product) return null

  const images = [product.imageUrl, ...(product.images ?? [])]
  const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean) as string[])]
  const colorVariants = product.variants?.filter(v => v.color) ?? []

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <FastImage
            source={{ uri: images[selectedImageIndex] ?? product.imageUrl, priority: FastImage.priority.high }}
            style={styles.mainImage}
            resizeMode={FastImage.resizeMode.cover}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: `${colors.surface}CC`, borderRadius: radius.full }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: colors.textPrimary }}>←</Text>
          </TouchableOpacity>

          {/* Wishlist */}
          <TouchableOpacity
            style={[styles.wishlistAbsBtn, { backgroundColor: `${colors.surface}CC`, borderRadius: radius.full }]}
            onPress={() => { void handleWishlist() }}
          >
            <Text style={{ color: isWishlisted ? colors.accent : colors.textPrimary, fontSize: 20 }}>
              {isWishlisted ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>

          {/* 3D View Button */}
          {product.threeDModelUrl && (
            <TouchableOpacity
              style={[styles.threeDBtn, { backgroundColor: colors.primary, borderRadius: radius.full }]}
              // @ts-ignore
              onPress={() => navigation.navigate(ROUTES.THREE_D_VIEWER, { modelUrl: product.threeDModelUrl })}
            >
              <Text style={[typography.caption, { color: colors.textInverse }]}>{t('product.view3D')}</Text>
            </TouchableOpacity>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <View style={styles.thumbnails}>
              {images.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedImageIndex(i)}
                  style={[
                    styles.thumb,
                    {
                      borderColor: selectedImageIndex === i ? colors.primary : 'transparent',
                      borderRadius: radius.sm,
                    },
                  ]}
                >
                  <FastImage source={{ uri: img }} style={styles.thumbImage} resizeMode={FastImage.resizeMode.cover} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.infoSection, { paddingHorizontal: spacing.md }]}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            {product.isNew && <Badge variant="new" />}
            {product.isHot && <Badge variant="hot" />}
            {product.isFlashSale && <Badge variant="flashSale" />}
          </View>

          <Text style={[typography.h3, { color: colors.textPrimary, marginTop: 8 }]}>{product.title}</Text>

          {/* Rating */}
          {product.rating && (
            <TouchableOpacity
              style={styles.ratingRow}
              // @ts-ignore
              onPress={() => navigation.navigate(ROUTES.REVIEWS, { productId: product.id })}
            >
              <Text style={{ color: colors.warning }}>{'★'.repeat(Math.round(product.rating))}</Text>
              <Text style={[typography.body2, { color: colors.textSecondary }]}>
                {product.rating.toFixed(1)} ({product.reviewCount} {t('product.reviews')})
              </Text>
              <Text style={[typography.caption, { color: colors.primary }]}>→</Text>
            </TouchableOpacity>
          )}

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[typography.h2, { color: colors.primary }]}>
              {formatCurrency(product.price, product.currency)}
            </Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={[typography.body1, { color: colors.textMuted, textDecorationLine: 'line-through' }]}>
                {formatCurrency(product.originalPrice, product.currency)}
              </Text>
            )}
          </View>

          {/* Sizes */}
          {sizes.length > 0 && (
            <View style={styles.optionSection}>
              <View style={styles.optionHeader}>
                <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('product.selectSize')}</Text>
                <TouchableOpacity
                  // @ts-ignore
                  onPress={() => navigation.navigate(ROUTES.SIZE_GUIDE, { category: product.category })}
                >
                  <Text style={[typography.caption, { color: colors.primary }]}>{t('product.sizeGuide')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chips}>
                {sizes.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeChip,
                      {
                        borderColor: selectedSize === size ? colors.primary : colors.border,
                        backgroundColor: selectedSize === size ? colors.primary : colors.surface,
                        borderRadius: radius.md,
                      },
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[typography.label, { color: selectedSize === size ? colors.textInverse : colors.textSecondary }]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Colors */}
          {colorVariants.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>{t('product.selectColor')}</Text>
              <View style={styles.colorRow}>
                {colorVariants.map(v => (
                  <TouchableOpacity
                    key={v.id}
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: v.colorHex ?? '#ccc',
                        borderColor: selectedColor === v.color ? colors.primary : 'transparent',
                      },
                    ]}
                    onPress={() => setSelectedColor(v.color ?? null)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 8 }]}>{t('product.description')}</Text>
              <Text style={[typography.body2, { color: colors.textSecondary, lineHeight: 24 }]}>{product.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <LinearGradient
        colors={[`${colors.background}00`, colors.background]}
        style={[styles.bottomCta, { paddingHorizontal: spacing.md }]}
      >
        <Button
          label={product.isOutOfStock ? t('product.outOfStock') : t('product.addToCart')}
          onPress={() => { void handleAddToCart() }}
          loading={isAddingToCart}
          disabled={!!product.isOutOfStock}
          variant="primary"
        />
      </LinearGradient>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: { position: 'relative' },
  mainImage: { width, height: width * 1.1 },
  backBtn: { position: 'absolute', top: 16, left: 16, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  wishlistAbsBtn: { position: 'absolute', top: 16, right: 16, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  threeDBtn: { position: 'absolute', bottom: 80, right: 16, paddingHorizontal: 12, paddingVertical: 6 },
  thumbnails: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  thumb: { borderWidth: 2, overflow: 'hidden' },
  thumbImage: { width: 48, height: 48 },
  infoSection: { paddingTop: 16, paddingBottom: 120 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginTop: 8 },
  optionSection: { marginTop: 20 },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeChip: { width: 52, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2 },
  section: { marginTop: 20 },
  bottomCta: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 24, paddingBottom: 32 },
})

export default ProductDetailScreen
