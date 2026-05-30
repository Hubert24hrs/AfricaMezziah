import React, { memo, useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import FastImage from 'react-native-fast-image'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetCategoriesQuery, Category } from '@store/api/productsApi'
import Skeleton from '@shared/components/Skeleton'
import { ROUTES } from '@shared/constants/routes'

const { width } = Dimensions.get('window')
const CARD_SIZE = (width - 48 - 12) / 2

type CategoryRouteParams = {
  Category: { categoryId: string; categoryName: string; heroImage?: string }
}

interface SubcategoryCardProps {
  item: Category
  onPress: (item: Category) => void
  colors: ReturnType<typeof useTheme>['colors']
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = memo(({ item, onPress, colors }) => {
  const handlePress = useCallback(() => onPress(item), [item, onPress])
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <FastImage
        source={{ uri: item.image, priority: FastImage.priority.normal }}
        style={styles.cardImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.cardOverlay} />
      <Text style={[styles.cardName, { color: colors.textPrimary }]} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  )
})

/** Category screen showing subcategory grid with hero image header */
const CategoryScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<CategoryRouteParams, 'Category'>>()
  const { categoryId, categoryName, heroImage } = route.params

  const { data: categories, isLoading } = useGetCategoriesQuery()

  const subcategories = useMemo(() => {
    if (!categories) return []
    const parent = categories.find(c => c.id === categoryId)
    return parent?.subcategories ?? []
  }, [categories, categoryId])

  const handleSubcategoryPress = useCallback(
    (item: Category) => {
      navigation.navigate(ROUTES.PRODUCT_LIST, {
        categoryId: item.id,
        categoryName: item.name,
      })
    },
    [navigation],
  )

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <SubcategoryCard item={item} onPress={handleSubcategoryPress} colors={colors} />
    ),
    [handleSubcategoryPress, colors],
  )

  const keyExtractor = useCallback((item: Category) => item.id, [])

  const ListHeader = useMemo(
    () => (
      <View>
        {heroImage ? (
          <View style={styles.heroContainer}>
            <FastImage
              source={{ uri: heroImage, priority: FastImage.priority.high }}
              style={styles.heroImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={[styles.heroGradient, { backgroundColor: 'rgba(15,15,26,0.5)' }]} />
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{categoryName}</Text>
          </View>
        ) : (
          <View style={[styles.heroPlaceholder, { backgroundColor: colors.surface }]}>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{categoryName}</Text>
          </View>
        )}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {t('catalog.browseSubcategories')}
        </Text>
      </View>
    ),
    [heroImage, categoryName, colors, t],
  )

  const SkeletonGrid = useMemo(
    () => (
      <View style={styles.skeletonGrid}>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} width={CARD_SIZE} height={CARD_SIZE + 20} borderRadius={12} />
          ))}
      </View>
    ),
    [],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        activeOpacity={0.75}
      >
        <Text style={[styles.backText, { color: colors.textSecondary }]}>
          {'← ' + t('common.back')}
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <>
          {ListHeader}
          {SkeletonGrid}
        </>
      ) : (
        <FlashList
          data={subcategories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          estimatedItemSize={CARD_SIZE + 20}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { paddingHorizontal: 16, paddingVertical: 12 },
  backText: { fontFamily: 'Poppins-Medium', fontSize: 14 },
  heroContainer: { height: 200, position: 'relative', marginBottom: 0 },
  heroImage: { width: '100%', height: 200 },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  heroPlaceholder: { height: 120, alignItems: 'center', justifyContent: 'center' },
  heroTitle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
  },
  sectionLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    margin: 4,
    justifyContent: 'flex-end',
  },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    padding: 10,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
})

export default CategoryScreen
