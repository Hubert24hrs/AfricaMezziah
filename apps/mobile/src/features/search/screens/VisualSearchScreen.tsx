import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@shared/hooks/useTheme'
import { useVisualSearchMutation } from '@store/api/productsApi'
import ProductCard from '@shared/components/ProductCard'
import { ProductCardSkeleton } from '@shared/components/Skeleton'
import { FlashList } from '@shopify/flash-list'
import { ROUTES } from '@constants/routes'

const VisualSearchScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [visualSearch, { isLoading, data: results }] = useVisualSearchMutation()

  const pickImage = useCallback(async (fromCamera: boolean) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 })

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]
      setImageUri(asset.uri)
      if (asset.base64) {
        await visualSearch({ imageBase64: asset.base64 })
      }
    }
  }, [visualSearch])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>Visual Search</Text>
        <View style={{ width: 24 }} />
      </View>

      {!imageUri ? (
        <View style={styles.uploadArea}>
          <Text style={styles.uploadIcon}>🖼️</Text>
          <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 8 }]}>Find Similar Items</Text>
          <Text style={[typography.body2, { color: colors.textSecondary, textAlign: 'center', marginBottom: 32 }]}>
            Take a photo or upload an image to find similar products
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: colors.primary, borderRadius: radius.lg }]}
              onPress={() => { void pickImage(true) }}
              activeOpacity={0.75}
            >
              <Text style={styles.btnIcon}>📷</Text>
              <Text style={[typography.label, { color: colors.textInverse }]}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }]}
              onPress={() => { void pickImage(false) }}
              activeOpacity={0.75}
            >
              <Text style={styles.btnIcon}>🖼️</Text>
              <Text style={[typography.label, { color: colors.textPrimary }]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.previewRow}>
            <FastImage source={{ uri: imageUri }} style={[styles.preview, { borderRadius: radius.md }]} />
            <View style={styles.previewText}>
              <Text style={[typography.body1, { color: colors.textPrimary }]}>Similar Items</Text>
              {results && <Text style={[typography.caption, { color: colors.textMuted }]}>{results.length} found</Text>}
            </View>
            <TouchableOpacity onPress={() => { setImageUri(null) }}>
              <Text style={{ color: colors.textMuted, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.skeletonGrid}>
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </View>
          ) : (
            <FlashList
              data={results ?? []}
              numColumns={2}
              estimatedItemSize={280}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 6 }}
              renderItem={({ item }) => (
                <ProductCard
                  id={item.id}
                  title={item.title}
                  price={item.price}
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
        </View>
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  uploadArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  uploadIcon: { fontSize: 64, marginBottom: 24 },
  btnRow: { flexDirection: 'row', gap: 16 },
  uploadBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 },
  btnIcon: { fontSize: 20 },
  resultsContainer: { flex: 1 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  preview: { width: 64, height: 64 },
  previewText: { flex: 1 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 6 },
})

export default VisualSearchScreen
