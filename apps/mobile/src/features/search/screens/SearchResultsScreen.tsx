import React, { memo, useState, useCallback } from 'react'
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

const SearchResultsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { q } = route.params ?? {}

  const { data, isLoading } = useGetProductsQuery({ q: q as string, limit: 20 })

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>"{q}"</Text>
        <View style={{ width: 24 }} />
      </View>

      {data?.meta && (
        <Text style={[typography.caption, { color: colors.textMuted, paddingHorizontal: spacing.md, marginBottom: 8 }]}>
          {data.meta.total} results
        </Text>
      )}

      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </View>
      ) : (data?.data ?? []).length === 0 ? (
        <EmptyState emoji="🔍" title={t('catalog.noProductsFound')} subtitle={t('catalog.adjustFilters')} />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 6 },
})

export default SearchResultsScreen
