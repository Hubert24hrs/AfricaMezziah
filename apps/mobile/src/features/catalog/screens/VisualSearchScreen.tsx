import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import FastImage from 'react-native-fast-image'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@shared/hooks/useTheme'
import { useVisualSearchMutation, Product } from '@store/api/productsApi'
import ProductCard from '@shared/components/ProductCard'
import Button from '@shared/components/Button'
import Skeleton from '@shared/components/Skeleton'
import { ROUTES } from '@shared/constants/routes'

const { height } = Dimensions.get('window')

/** Visual search screen — camera capture or gallery pick, similarity results grid */
const VisualSearchScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [permission, requestPermission] = useCameraPermissions()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [results, setResults] = useState<Product[]>([])
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null)
  const [visualSearch, { isLoading }] = useVisualSearchMutation()

  const handleCapture = useCallback(async () => {
    if (!cameraRef) return
    try {
      const photo = await cameraRef.takePictureAsync({ base64: true, quality: 0.7 })
      if (photo?.base64) {
        setCapturedImage(photo.uri)
        const res = await visualSearch({ imageBase64: photo.base64 }).unwrap()
        setResults(res)
      }
    } catch {
      Alert.alert(t('errors.generic'))
    }
  }, [cameraRef, visualSearch, t])

  const handleGalleryPick = useCallback(async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    })
    if (!pickerResult.canceled && pickerResult.assets[0]?.base64) {
      const asset = pickerResult.assets[0]
      setCapturedImage(asset.uri)
      try {
        const res = await visualSearch({ imageBase64: asset.base64! }).unwrap()
        setResults(res)
      } catch {
        Alert.alert(t('errors.generic'))
      }
    }
  }, [visualSearch, t])

  const handleRetake = useCallback(() => {
    setCapturedImage(null)
    setResults([])
  }, [])

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

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.permText}>{t('visual.checkingPermission')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.permTitle}>{t('visual.cameraPermissionTitle')}</Text>
          <Text style={styles.permText}>{t('visual.cameraPermissionDesc')}</Text>
          <Button title={t('visual.grantPermission')} onPress={requestPermission} style={styles.permButton} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn} activeOpacity={0.75}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.75}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>{t('visual.title')}</Text>

      {!capturedImage ? (
        <View style={styles.cameraSection}>
          <CameraView
            ref={ref => setCameraRef(ref)}
            style={styles.camera}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame} />
            </View>
          </CameraView>
          <View style={styles.cameraActions}>
            <TouchableOpacity onPress={handleGalleryPick} style={styles.galleryBtn} activeOpacity={0.75}>
              <Text style={styles.galleryIcon}>🖼</Text>
              <Text style={[styles.galleryLabel, { color: colors.textSecondary }]}>{t('visual.gallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCapture} style={styles.captureBtn} activeOpacity={0.75}>
              <View style={[styles.captureInner, { borderColor: colors.primary }]} />
            </TouchableOpacity>
            <View style={{ width: 60 }} />
          </View>
        </View>
      ) : (
        <View style={styles.resultsSection}>
          <View style={styles.capturedRow}>
            <FastImage source={{ uri: capturedImage }} style={styles.capturedThumb} />
            <View style={styles.capturedInfo}>
              <Text style={[styles.capturedLabel, { color: colors.textPrimary }]}>
                {t('visual.analyzingImage')}
              </Text>
              <TouchableOpacity onPress={handleRetake} activeOpacity={0.75}>
                <Text style={[styles.retakeText, { color: colors.primary }]}>{t('visual.retake')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.skeletonGrid}>
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} width={170} height={260} borderRadius={12} />)}
            </View>
          ) : results.length > 0 ? (
            <FlashList
              data={results}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              numColumns={2}
              estimatedItemSize={260}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.center}>
              <Text style={[styles.noResults, { color: colors.textMuted }]}>{t('visual.noResults')}</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    backBtn: { paddingHorizontal: 16, paddingTop: 8 },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary },
    header: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: colors.textPrimary, paddingHorizontal: 20, paddingVertical: 8 },
    cameraSection: { flex: 1 },
    camera: { flex: 1, maxHeight: height * 0.55 },
    cameraOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scanFrame: {
      width: 220,
      height: 220,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
    },
    cameraActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 40,
      paddingVertical: 32,
    },
    galleryBtn: { alignItems: 'center', gap: 4 },
    galleryIcon: { fontSize: 32 },
    galleryLabel: { fontFamily: 'Poppins-Regular', fontSize: 12 },
    captureBtn: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 3,
      backgroundColor: 'transparent',
    },
    resultsSection: { flex: 1 },
    capturedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    capturedThumb: { width: 60, height: 60, borderRadius: 8 },
    capturedInfo: { flex: 1, gap: 4 },
    capturedLabel: { fontFamily: 'Poppins-Medium', fontSize: 14 },
    retakeText: { fontFamily: 'Poppins-Medium', fontSize: 13 },
    skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 8 },
    listContent: { paddingHorizontal: 8, paddingBottom: 24 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },
    permTitle: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: colors.textPrimary, textAlign: 'center' },
    permText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
    permButton: {},
    cancelBtn: { paddingVertical: 12 },
    cancelText: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textMuted },
    noResults: { fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center' },
  })

export default VisualSearchScreen
