import React, { memo, useState, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProductsQuery } from '@store/api/productsApi'
import { ROUTES } from '@constants/routes'
import ProductCard from '@shared/components/ProductCard'
import { ProductCardSkeleton } from '@shared/components/Skeleton'
import EmptyState from '@shared/components/EmptyState'
import ErrorBoundary from '@shared/components/ErrorBoundary'
import type BottomSheet from '@shared/components/BottomSheet'
import type { ProductsQuery } from '../catalog.types'

const ProductListScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore route params typing
  const { categoryId, title, q } = route.params ?? {}

  const [query, setQuery] = useState<ProductsQuery>({
    category: categoryId as string | undefined,
    q: q as string | undefined,
    page: 1,
    limit: 20,
  })

  const { data, isLoading, isFetching } = useGetProductsQuery(query)

  const handleProductPress = useCallback(
    (id: string) => {
      // @ts-ignore
      navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: id })
    },
    [navigation],
  )

  const handleLoadMore = useCallback(() => {
    if (data && query.page && query.page < data.meta.totalPages && !isFetching) {
      setQuery(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }))
    }
  }, [data, query.page, isFetching])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{title ?? t('catalog.allProducts')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surface, borderRadius: radius.full }]}
            // @ts-ignore
            onPress={() => navigation.navigate(ROUTES.FILTER_SCREEN)}
          >
            <Text>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surface, borderRadius: radius.full }]}
          >
            <Text>↕️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {data?.meta && (
        <Text style={[typography.caption, { color: colors.textMuted, paddingHorizontal: spacing.md, marginBottom: 8 }]}>
          {data.meta.total} items
        </Text>
      )}

      <ErrorBoundary>
        {isLoading ? (
          <View style={styles.skeletonGrid}>
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </View>
        ) : (data?.data ?? []).length === 0 ? (
          <EmptyState
            emoji="🔍"
            title={t('catalog.noProductsFound')}
            subtitle={t('catalog.adjustFilters')}
          />
        ) : (
          <FlashList
            data={data?.data ?? []}
            numColumns={2}
            estimatedItemSize={280}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 6 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <ProductCard
                id={item.id}
                title={item.title}
                price={item.price}
                originalPrice={item.originalPrice}
                imageUrl={item.imageUrl}
                rating={item.rating}
                reviewCount={item.reviewCount}
                isNew={item.isNew}
                isHot={item.isHot}
                isFlashSale={item.isFlashSale}
                isOutOfStock={item.isOutOfStock}
                onPress={() => handleProductPress(item.id)}
              />
            )}
          />
        )}
      </ErrorBoundary>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 6 },
})

export default ProductListScreen
