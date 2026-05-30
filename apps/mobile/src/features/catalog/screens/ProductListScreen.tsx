import React, { memo, useCallback, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProductsQuery, Product } from '@store/api/productsApi'
import ProductCard from '@shared/components/ProductCard'
import Skeleton from '@shared/components/Skeleton'
import EmptyState from '@shared/components/EmptyState'
import { ROUTES } from '@shared/constants/routes'

const PAGE_LIMIT = 20

type ProductListRouteParams = {
  ProductList: {
    categoryId?: string
    categoryName?: string
    subcategoryId?: string
    filters?: Record<string, string | number>
    sort?: string
  }
}

interface FilterBarProps {
  onFilter: () => void
  onSort: () => void
  activeSort: string
  colors: ReturnType<typeof useTheme>['colors']
  t: (key: string) => string
}

const FilterBar: React.FC<FilterBarProps> = memo(({ onFilter, onSort, activeSort, colors, t }) => (
  <View style={[filterStyles.container, { borderBottomColor: colors.border }]}>
    <TouchableOpacity
      style={[filterStyles.btn, { borderColor: colors.border, backgroundColor: colors.surface }]}
      onPress={onFilter}
      activeOpacity={0.75}
    >
      <Text style={[filterStyles.btnText, { color: colors.textPrimary }]}>
        ⚙ {t('catalog.filter')}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[filterStyles.btn, { borderColor: colors.border, backgroundColor: colors.surface }]}
      onPress={onSort}
      activeOpacity={0.75}
    >
      <Text style={[filterStyles.btnText, { color: colors.textPrimary }]}>
        ↕ {activeSort ? t(`catalog.sort.${activeSort}`) : t('catalog.sort')}
      </Text>
    </TouchableOpacity>
  </View>
))

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnText: { fontFamily: 'Poppins-Medium', fontSize: 14 },
})

/** Product grid screen with infinite scroll using FlashList */
const ProductListScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<ProductListRouteParams, 'ProductList'>>()
  const { categoryId, categoryName, filters, sort: initialSort } = route.params ?? {}

  const [page, setPage] = useState(1)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [activeSort] = useState(initialSort ?? 'newest')

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      category: categoryId,
      sort: activeSort,
      ...filters,
    }),
    [page, categoryId, activeSort, filters],
  )

  const { data, isFetching, isLoading } = useGetProductsQuery(queryParams)

  const products = useMemo(() => {
    if (!data?.data) return allProducts
    if (page === 1) return data.data
    return [...allProducts, ...data.data]
  }, [data, page, allProducts])

  const hasMore = useMemo(
    () => data ? page < data.meta.totalPages : false,
    [data, page],
  )

  const handleEndReached = useCallback(() => {
    if (!isFetching && hasMore) {
      setAllProducts(products)
      setPage(p => p + 1)
    }
  }, [isFetching, hasMore, products])

  const handleFilter = useCallback(() => {
    navigation.navigate(ROUTES.PRODUCT_LIST, { categoryId, filters })
  }, [navigation, categoryId, filters])

  const handleSort = useCallback(() => {
    navigation.navigate(ROUTES.PRODUCT_LIST, { categoryId, filters, sort: activeSort })
  }, [navigation, categoryId, filters, activeSort])

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })}
      />
    ),
    [navigation],
  )

  const keyExtractor = useCallback((item: Product) => item.id, [])

  const ListFooter = useMemo(
    () =>
      isFetching && !isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
      ) : null,
    [isFetching, isLoading, colors.primary],
  )

  const SkeletonList = useMemo(
    () => (
      <View style={skeletonStyles.grid}>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} width={170} height={260} borderRadius={12} />
          ))}
      </View>
    ),
    [],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={[styles.backText, { color: colors.textSecondary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {categoryName ?? t('catalog.allProducts')}
        </Text>
        <Text style={[styles.countText, { color: colors.textMuted }]}>
          {data?.meta.total ?? 0}
        </Text>
      </View>

      <FilterBar
        onFilter={handleFilter}
        onSort={handleSort}
        activeSort={activeSort}
        colors={colors}
        t={t}
      />

      {isLoading ? (
        SkeletonList
      ) : products.length === 0 ? (
        <EmptyState
          title={t('catalog.noProducts')}
          description={t('catalog.noProductsDesc')}
        />
      ) : (
        <FlashList
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          estimatedItemSize={260}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backText: { fontFamily: 'Poppins-Medium', fontSize: 18 },
  headerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 18 },
  countText: { fontFamily: 'Inter-Regular', fontSize: 13 },
  listContent: { paddingHorizontal: 8, paddingBottom: 24 },
})

const skeletonStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 8 },
})

export default ProductListScreen
