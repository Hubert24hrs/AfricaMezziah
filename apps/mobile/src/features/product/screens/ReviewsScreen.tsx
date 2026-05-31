import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProductReviewsQuery } from '@store/api/productsApi'
import type { Review } from '@features/catalog/catalog.types'

const ReviewsScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { productId } = route.params ?? {}

  const { data } = useGetProductReviewsQuery({ id: productId as string })

  const renderReview = ({ item }: { item: Review }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadows.card }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[typography.label, { color: colors.textInverse }]}>
            {item.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[typography.label, { color: colors.textPrimary }]}>{item.userName}</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={{ color: colors.warning }}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
      </View>
      <Text style={[typography.label, { color: colors.textPrimary, marginTop: 8 }]}>{item.title}</Text>
      <Text style={[typography.body2, { color: colors.textSecondary, marginTop: 4 }]}>{item.body}</Text>
      {item.photos && item.photos.length > 0 && (
        <View style={styles.photos}>
          {item.photos.map((p, i) => (
            <FastImage key={i} source={{ uri: p }} style={[styles.photo, { borderRadius: radius.sm }]} />
          ))}
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.topHeader, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('product.reviews')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlashList
        data={data?.data ?? []}
        estimatedItemSize={150}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md } as any}
        renderItem={renderReview}
      />
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  card: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  photos: { flexDirection: 'row', gap: 8, marginTop: 12 },
  photo: { width: 72, height: 72 },
})

export default ReviewsScreen
