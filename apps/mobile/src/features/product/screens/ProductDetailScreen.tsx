import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProductQuery } from '@store/api/productsApi'
import { useAddToCartMutation } from '@store/api/cartApi'
import Button from '@shared/components/Button'
import Badge from '@shared/components/Badge'
import Toast from '@shared/components/Toast'
import { ROUTES } from '@shared/constants/routes'

const { width } = Dimensions.get('window')

type ProductDetailRouteParams = {
  ProductDetail: { productId: string }
}

/** Full product detail screen with gallery, selectors, add to cart */
const ProductDetailScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<ProductDetailRouteParams, 'ProductDetail'>>()
  const { productId } = route.params

  const { data: product, isLoading } = useGetProductQuery(productId)
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation()

  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const handleAddToCart = useCallback(async () => {
    if (!product) return
    const variant = product.variants.find(
      v => v.color === product.colors[selectedColor]?.name && v.size === product.sizes[selectedSize],
    )
    try {
      await addToCart({
        productId: product.id,
        variantId: variant?.id ?? product.variants[0]?.id ?? '',
        quantity: 1,
      }).unwrap()
      setToast({ msg: t('cart.addedToCart'), type: 'success' })
    } catch {
      setToast({ msg: t('errors.generic'), type: 'error' })
    }
  }, [product, selectedColor, selectedSize, addToCart, t])

  const handleBuyNow = useCallback(async () => {
    await handleAddToCart()
    navigation.navigate(ROUTES.CHECKOUT)
  }, [handleAddToCart, navigation])

  const discountPercent = useMemo(() => {
    if (!product?.originalPrice || !product?.price) return null
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  }, [product])

  const styles = useMemo(() => createStyles(colors), [colors])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    )
  }

  if (!product) return null

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setWishlisted(w => !w)}
          style={styles.heartBtn}
          activeOpacity={0.75}
        >
          <Text style={[styles.heartIcon, { color: wishlisted ? colors.accent : colors.textMuted }]}>
            {wishlisted ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width)
              setActiveImage(idx)
            }}
          >
            {product.images.map((img, i) => (
              <FastImage
                key={i}
                source={{ uri: img, priority: FastImage.priority.high }}
                style={styles.galleryImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ))}
          </ScrollView>
          <View style={styles.dotRow}>
            {product.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === activeImage ? colors.primary : colors.border },
                ]}
              />
            ))}
          </View>
          {discountPercent && (
            <View style={styles.discountBadge}>
              <Badge type="discount" label={`-${discountPercent}%`} />
            </View>
          )}
        </View>

        <View style={styles.details}>
          {/* Brand + Rating */}
          <View style={styles.metaRow}>
            <Text style={styles.brand}>{product.seller.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>{'★'.repeat(Math.round(product.rating))}</Text>
              <Text style={styles.ratingCount}>({product.reviewCount})</Text>
            </View>
          </View>

          {/* Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₦{product.originalPrice.toLocaleString()}</Text>
            )}
          </View>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <View style={styles.selectorSection}>
              <Text style={styles.selectorLabel}>
                {t('product.color')}: <Text style={styles.selectedValue}>{product.colors[selectedColor]?.name}</Text>
              </Text>
              <View style={styles.colorRow}>
                {product.colors.map((color, i) => (
                  <TouchableOpacity
                    key={color.name}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color.hex },
                      i === selectedColor && styles.colorSwatchActive,
                    ]}
                    onPress={() => setSelectedColor(i)}
                    activeOpacity={0.75}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <View style={styles.selectorSection}>
              <View style={styles.sizeLabelRow}>
                <Text style={styles.selectorLabel}>
                  {t('product.size')}: <Text style={styles.selectedValue}>{product.sizes[selectedSize]}</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.SIZE_GUIDE, { category: product.category })}
                  activeOpacity={0.75}
                >
                  <Text style={styles.sizeGuideLink}>{t('product.sizeGuide')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sizeRow}>
                {product.sizes.map((size, i) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeChip,
                      i === selectedSize
                        ? { backgroundColor: colors.primary, borderColor: colors.primary }
                        : { borderColor: colors.border },
                    ]}
                    onPress={() => setSelectedSize(i)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.sizeChipText,
                        { color: i === selectedSize ? colors.textInverse : colors.textPrimary },
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 3D View */}
          {product.has3dModel && (
            <TouchableOpacity
              style={[styles.threeDBtn, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate(ROUTES.THREE_D_VIEWER, { productId })}
              activeOpacity={0.75}
            >
              <Text style={[styles.threeDText, { color: colors.primary }]}>
                ◈ {t('product.view3D')}
              </Text>
            </TouchableOpacity>
          )}

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>{t('product.description')}</Text>
            <Text style={styles.desc}>{product.description}</Text>
          </View>

          {/* Reviews shortcut */}
          <TouchableOpacity
            style={[styles.reviewsBtn, { borderColor: colors.border }]}
            onPress={() => navigation.navigate(ROUTES.REVIEWS, { productId })}
            activeOpacity={0.75}
          >
            <Text style={[styles.reviewsBtnText, { color: colors.textPrimary }]}>
              {t('product.seeAllReviews')} ({product.reviewCount}) →
            </Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom */}
      <View style={[styles.stickyBottom, { borderTopColor: colors.border }]}>
        <Button
          title={t('cart.addToCart')}
          onPress={handleAddToCart}
          loading={isAdding}
          variant="secondary"
          style={styles.addBtn}
        />
        <Button
          title={t('cart.buyNow')}
          onPress={handleBuyNow}
          style={styles.buyBtn}
        />
      </View>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary },
    heartBtn: { padding: 8 },
    heartIcon: { fontSize: 26 },
    scroll: { flex: 1 },
    galleryImage: { width, height: 380 },
    dotRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    discountBadge: { position: 'absolute', top: 16, left: 16 },
    details: { paddingHorizontal: 20, paddingTop: 20 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    brand: { fontFamily: 'Poppins-Medium', fontSize: 13, color: colors.textMuted },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    stars: { color: colors.primary, fontSize: 14 },
    ratingCount: { fontFamily: 'Inter-Regular', fontSize: 12, color: colors.textMuted },
    productName: { fontFamily: 'PlayfairDisplay-SemiBold', fontSize: 22, color: colors.textPrimary, marginBottom: 12 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    price: { fontFamily: 'Inter-Bold', fontSize: 24, color: colors.primary },
    originalPrice: { fontFamily: 'Inter-Regular', fontSize: 16, color: colors.textMuted, textDecorationLine: 'line-through' },
    selectorSection: { marginBottom: 20 },
    selectorLabel: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textSecondary, marginBottom: 10 },
    selectedValue: { color: colors.textPrimary },
    colorRow: { flexDirection: 'row', gap: 12 },
    colorSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
    colorSwatchActive: { borderColor: colors.primary, transform: [{ scale: 1.1 }] },
    sizeLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    sizeGuideLink: { fontFamily: 'Poppins-Medium', fontSize: 13, color: colors.primary },
    sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    sizeChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1.5,
    },
    sizeChipText: { fontFamily: 'Poppins-Medium', fontSize: 13 },
    threeDBtn: {
      borderWidth: 1.5,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    threeDText: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
    descSection: { marginBottom: 20 },
    descTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 8 },
    desc: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
    reviewsBtn: {
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 20,
    },
    reviewsBtnText: { fontFamily: 'Poppins-Medium', fontSize: 14 },
    stickyBottom: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      gap: 12,
    },
    addBtn: { flex: 1 },
    buyBtn: { flex: 1 },
  })

export default ProductDetailScreen
