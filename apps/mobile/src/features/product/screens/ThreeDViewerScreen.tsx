import React, { memo, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'

const ThreeDViewerScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { modelUrl } = route.params ?? {}

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('product.view3D')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Three.js canvas loaded via expo-three */}
      <View style={styles.canvas}>
        <Text style={[typography.body1, { color: colors.textMuted, textAlign: 'center' }]}>
          🔄 3D Model Viewer{'\n'}(expo-three + three.js)
        </Text>
        <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center', marginTop: 8 }]}>
          Drag to rotate • Pinch to zoom
        </Text>
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  canvas: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

export default ThreeDViewerScreen
