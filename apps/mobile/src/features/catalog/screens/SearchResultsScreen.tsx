import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProductsQuery, Product } from '@store/api/productsApi'
import ProductCard from '@shared/components/ProductCard'
import EmptyState from '@shared/components/EmptyState'
import Skeleton from '@shared/components/Skeleton'
import { ROUTES } from '@shared/constants/routes'

const PAGE_LIMIT = 20

type SearchResultsRouteParams = {
  SearchResults: { query: string; sort?: string }
}

/** Search results screen — product grid filtered by search query */
const SearchResultsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<SearchResultsRouteParams, 'SearchResults'>>()
  const { query: initialQuery, sort: initialSort } = route.params

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)
  const [page, setPage] = useState(1)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [sort] = useState(initialSort ?? 'newest')

  const { data, isFetching, isLoading } = useGetProductsQuery({
    q: activeQuery,
    page,
    limit: PAGE_LIMIT,
    sort,
  })

  const products = useMemo(() => {
    if (!data?.data) return allProducts
    if (page === 1) return data.data
    return [...allProducts, ...data.data]
  }, [data, page, allProducts])

  const hasMore = useMemo(() => data ? page < data.meta.totalPages : false, [data, page])

  const handleSubmit = useCallback(() => {
    if (!searchQuery.trim()) return
    setAllProducts([])
    setPage(1)
    setActiveQuery(searchQuery.trim())
  }, [searchQuery])

  const handleEndReached = useCallback(() => {
    if (!isFetching && hasMore) {
      setAllProducts(products)
      setPage(p => p + 1)
    }
  }, [isFetching, hasMore, products])

  const handleFilter = useCallback(() => {
    navigation.navigate(ROUTES.PRODUCT_LIST, { sort })
  }, [navigation, sort])

  const handleSort = useCallback(() => {
    navigation.navigate(ROUTES.PRODUCT_LIST, { sort })
  }, [navigation, sort])

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

  const styles = useMemo(() => createStyles(colors), [colors])

  const ListHeader = useMemo(
    () => (
      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {data ? t('search.resultsCount', { count: data.meta.total, query: activeQuery }) : ''}
        </Text>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, { borderColor: colors.border }]}
            onPress={handleFilter}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterBtnText, { color: colors.textPrimary }]}>⚙ {t('catalog.filter')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, { borderColor: colors.border }]}
            onPress={handleSort}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterBtnText, { color: colors.textPrimary }]}>↕ {t('catalog.sort.' + sort)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [data, activeQuery, sort, colors, t, handleFilter, handleSort],
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={colors.textMuted}
            placeholder={t('search.placeholder')}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} width={170} height={260} borderRadius={12} />
          ))}
        </View>
      ) : products.length === 0 ? (
        <EmptyState
          title={t('search.noResults')}
          description={t('search.noResultsDesc', { query: activeQuery })}
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
          ListHeaderComponent={ListHeader}
          ListFooterComponent={
            isFetching && !isLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    back: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary, paddingHorizontal: 4 },
    inputWrap: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 14,
      height: 44,
      justifyContent: 'center',
    },
    input: { fontFamily: 'Poppins-Regular', fontSize: 15 },
    resultHeader: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
    resultCount: { fontFamily: 'Poppins-Regular', fontSize: 13, color: colors.textMuted, marginBottom: 10 },
    filterRow: { flexDirection: 'row', gap: 10 },
    filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
    filterBtnText: { fontFamily: 'Poppins-Medium', fontSize: 13 },
    listContent: { paddingHorizontal: 8, paddingBottom: 24 },
    skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 8 },
  })

export default SearchResultsScreen
