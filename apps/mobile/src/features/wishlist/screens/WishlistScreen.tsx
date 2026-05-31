import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@store/api/userApi'
import { useAddToCartMutation } from '@store/api/cartApi'
import { ROUTES } from '@constants/routes'
import ProductCard from '@shared/components/ProductCard'
import EmptyState from '@shared/components/EmptyState'

const WishlistScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()

  const { data } = useGetWishlistQuery({})
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const [addToCart] = useAddToCartMutation()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[typography.h4, { color: colors.textPrimary, padding: spacing.md }]}>{t('wishlist.title')}</Text>

      {(data?.data ?? []).length === 0 ? (
        <EmptyState
          emoji="❤️"
          title={t('wishlist.empty')}
          subtitle={t('wishlist.emptySubtitle')}
          actionLabel="Start Shopping"
          // @ts-ignore
          onAction={() => navigation.navigate(ROUTES.TAB_HOME)}
        />
      ) : (
        <FlashList
          data={data?.data ?? []}
          numColumns={2}
          estimatedItemSize={280}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 6 }}
          renderItem={({ item }) => (
            <ProductCard
              id={item.id}
              title={item.title}
              price={item.price}
              originalPrice={item.originalPrice}
              imageUrl={item.imageUrl}
              rating={item.rating}
              isWishlisted
              onPress={() => {
                // @ts-ignore
                navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default WishlistScreen
