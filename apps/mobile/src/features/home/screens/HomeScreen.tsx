import React, { memo, useCallback } from 'react'
import { View, ScrollView, StyleSheet, RefreshControl, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetHomeDataQuery } from '@store/api/homeApi'
import HeroBanner from '@features/home/components/HeroBanner'
import CategoryGrid from '@features/home/components/CategoryGrid'
import FlashSaleStrip from '@features/home/components/FlashSaleStrip'
import ProductStrip from '@features/home/components/ProductStrip'
import MasonryGrid from '@features/home/components/MasonryGrid'
import Skeleton from '@shared/components/Skeleton'
import ErrorBoundary from '@shared/components/ErrorBoundary'
import { ROUTES } from '@shared/constants/routes'

const HomeScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data, isLoading, refetch, isFetching } = useGetHomeDataQuery()

  const goToProduct = useCallback((id: string) => {
    navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: id })
  }, [navigation])

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.skeletonContainer}>
          <Skeleton height={280} borderRadius={0} />
          <View style={{ padding: 16, gap: 16 }}>
            {[1,2,3].map(i => <Skeleton key={i} height={120} borderRadius={12} />)}
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary} />}
        >
          {data?.banners && <HeroBanner banners={data.banners} />}

          <View style={styles.promoBar}>
            <Text style={[styles.promoText, { color: colors.textSecondary }]}>
              {t('home.freeShipping', { amount: '₦15,000' })}
            </Text>
          </View>

          <CategoryGrid onCategoryPress={id => navigation.navigate(ROUTES.CATEGORY, { categoryId: id })} />

          {data?.flashSaleProducts && (
            <FlashSaleStrip
              endTime={data.flashSaleEndTime}
              products={data.flashSaleProducts}
              onProductPress={goToProduct}
            />
          )}

          {data?.aiPicks && (
            <ProductStrip
              title={t('home.aiPicks')}
              products={data.aiPicks}
              onProductPress={goToProduct}
              onSeeAll={() => navigation.navigate(ROUTES.PRODUCT_LIST, { source: 'ai-picks' })}
            />
          )}

          {data?.trending && (
            <MasonryGrid
              title={t('home.trending')}
              products={data.trending}
              onProductPress={goToProduct}
            />
          )}

          {data?.newArrivals && (
            <ProductStrip
              title={t('home.newArrivals')}
              products={data.newArrivals}
              onProductPress={goToProduct}
              onSeeAll={() => navigation.navigate(ROUTES.PRODUCT_LIST, { source: 'new-arrivals' })}
            />
          )}

          {data?.superDeals && (
            <ProductStrip
              title={t('home.superDeals')}
              products={data.superDeals}
              onProductPress={goToProduct}
              onSeeAll={() => navigation.navigate(ROUTES.PRODUCT_LIST, { source: 'super-deals' })}
            />
          )}

          <View style={styles.bottomPad} />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  skeletonContainer: { flex: 1 },
  promoBar: { backgroundColor: '#1A1A2E', paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  promoText: { fontFamily: 'Poppins-Regular', fontSize: 12 },
  bottomPad: { height: 32 },
})

export default HomeScreen
