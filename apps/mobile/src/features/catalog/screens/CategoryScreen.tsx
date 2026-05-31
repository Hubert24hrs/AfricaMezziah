import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetCategoriesQuery } from '@store/api/productsApi'
import { ROUTES } from '@constants/routes'
import ErrorBoundary from '@shared/components/ErrorBoundary'
import { ProductCardSkeleton } from '@shared/components/Skeleton'
import type { Category } from '../catalog.types'

const CategoryScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const { data: categories, isLoading } = useGetCategoriesQuery()

  const handlePress = useCallback(
    (category: Category) => {
      // @ts-ignore
      navigation.navigate(ROUTES.PRODUCT_LIST, { categoryId: category.id, title: category.name })
    },
    [navigation],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('catalog.allProducts')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ErrorBoundary>
        {isLoading ? (
          <View style={styles.skeletonGrid}>
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlashList
            data={categories ?? []}
            numColumns={2}
            estimatedItemSize={200}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: spacing.md }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}
                onPress={() => handlePress(item)}
                activeOpacity={0.85}
              >
                <FastImage
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.overlay}>
                  <Text style={[typography.h4, { color: '#FFFFFF' }]}>{item.name}</Text>
                  <Text style={[typography.caption, { color: 'rgba(255,255,255,0.7)' }]}>
                    {item.productCount} items
                  </Text>
                </View>
              </TouchableOpacity>
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
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16 },
  card: { flex: 1, margin: 6, height: 160, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})

export default CategoryScreen
