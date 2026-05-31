import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAppSelector } from '@store/store'
import { useGetHomeDataQuery } from '@store/api/homeApi'
import { ROUTES } from '@constants/routes'
import ErrorBoundary from '@shared/components/ErrorBoundary'
import { ProductCardSkeleton } from '@shared/components/Skeleton'
import HeroBanner from '../components/HeroBanner'
import CategoryGrid from '../components/CategoryGrid'
import FlashSaleStrip from '../components/FlashSaleStrip'
import ProductStrip from '../components/ProductStrip'
import MasonryGrid from '../components/MasonryGrid'

const HomeScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()
  const user = useAppSelector(state => state.auth.user)

  const { data, isLoading, refetch } = useGetHomeDataQuery()

  const handleSearchPress = useCallback(() => {
    // @ts-ignore
    navigation.navigate(ROUTES.TAB_DISCOVER)
  }, [navigation])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View>
          <Text style={[typography.caption, { color: colors.textMuted }]}>{t('common.appName')}</Text>
          {user && (
            <Text style={[typography.h4, { color: colors.textPrimary }]}>
              {t('home.greeting', { name: user.name.split(' ')[0] })}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999 }]}
          onPress={handleSearchPress}
          activeOpacity={0.75}
        >
          <Text style={{ color: colors.textMuted }}>🔍</Text>
          <Text style={[typography.body2, { color: colors.textMuted, marginLeft: 8 }]}>
            {t('common.search')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        <ErrorBoundary>
          {/* 1. Hero Banner */}
          {isLoading ? (
            <View style={[styles.bannerSkeleton, { backgroundColor: colors.surface }]} />
          ) : (
            data?.banners && <HeroBanner banners={data.banners} />
          )}

          {/* 2. Promo Bar */}
          <View style={[styles.promoBar, { backgroundColor: colors.surface, marginHorizontal: spacing.md }]}>
            <Text style={[typography.caption, { color: colors.primary }]}>🚚 {t('home.freeShipping', { amount: '₦50,000' })}</Text>
            <Text style={[typography.caption, { color: colors.accent }]}>⚡ {t('home.shopFlashSale')}</Text>
          </View>

          {/* 3. Category Grid */}
          <View style={styles.sectionGap}>
            <Text style={[typography.h4, { color: colors.textPrimary, paddingHorizontal: spacing.md, marginBottom: 12 }]}>
              {t('home.categories')}
            </Text>
            <CategoryGrid />
          </View>

          {/* 4. Flash Sale Strip */}
          {isLoading ? (
            <View style={styles.sectionGap}>
              {[...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </View>
          ) : data?.flashSale && (
            <FlashSaleStrip endsAt={data.flashSale.endsAt} products={data.flashSale.products} />
          )}

          {/* 5. AI Picks */}
          {!isLoading && data?.aiPicks && (
            <View style={styles.sectionGap}>
              <View style={[styles.aiHeader, { paddingHorizontal: spacing.md }]}>
                <Text style={styles.aiSpark}>✨</Text>
                <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('home.aiPicks')}</Text>
              </View>
              <ProductStrip title="" products={data.aiPicks} />
            </View>
          )}

          {/* 6. Trending Masonry */}
          {!isLoading && data?.trending && (
            <View style={styles.sectionGap}>
              <Text style={[typography.h4, { color: colors.textPrimary, paddingHorizontal: spacing.md, marginBottom: 12 }]}>
                {t('home.trending')}
              </Text>
              <MasonryGrid products={data.trending} />
            </View>
          )}

          {/* 7. New Arrivals */}
          {!isLoading && data?.newArrivals && (
            <ProductStrip
              title={t('home.newArrivals')}
              products={data.newArrivals}
              badgeType="new"
              seeAllRoute={ROUTES.PRODUCT_LIST}
            />
          )}

          {/* 8. Super Deals */}
          {!isLoading && data?.superDeals && (
            <ProductStrip
              title={t('home.superDeals')}
              products={data.superDeals}
              seeAllRoute={ROUTES.PRODUCT_LIST}
            />
          )}

          <View style={styles.bottomPad} />
        </ErrorBoundary>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    flex: 0.6,
  },
  sectionGap: { marginBottom: 24 },
  bannerSkeleton: { height: 280 },
  promoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  aiSpark: { fontSize: 20 },
  bottomPad: { height: 32 },
})

export default HomeScreen
