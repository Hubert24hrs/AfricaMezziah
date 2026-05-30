import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@store/api/userApi'
import ProductCard from '@shared/components/ProductCard'
import EmptyState from '@shared/components/EmptyState'
import Skeleton from '@shared/components/Skeleton'
import { ROUTES } from '@shared/constants/routes'

const { width } = Dimensions.get('window')
const CARD_W = (width - 48) / 2

const WishlistScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data, isLoading } = useGetWishlistQuery({})
  const [removeFromWishlist] = useRemoveFromWishlistMutation()

  const handleProductPress = useCallback((id: string) => {
    navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: id })
  }, [navigation])

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} width={CARD_W} height={260} borderRadius={12} />)}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{t('wishlist.title')}</Text>
      {!data?.data.length ? (
        <EmptyState title={t('wishlist.empty')} subtitle={t('wishlist.emptySubtitle')} icon="heart-outline"
          ctaLabel="Shop Now" onCta={() => navigation.navigate(ROUTES.HOME_TAB)} />
      ) : (
        <FlashList
          data={data.data}
          numColumns={2}
          estimatedItemSize={260}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={{ padding: 6 }}>
              <ProductCard
                product={item}
                inWishlist
                onPress={() => handleProductPress(item.id)}
                onWishlistToggle={() => removeFromWishlist(item.id)}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 20, padding: 16, paddingBottom: 8 },
  list: { padding: 6 },
})

export default WishlistScreen
