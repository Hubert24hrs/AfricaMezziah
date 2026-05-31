import React, { memo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'

const SIZE_DATA = [
  { size: 'XS', bust: '79-82', waist: '61-64', hips: '87-90' },
  { size: 'S', bust: '83-86', waist: '65-68', hips: '91-94' },
  { size: 'M', bust: '87-90', waist: '69-72', hips: '95-98' },
  { size: 'L', bust: '91-95', waist: '73-77', hips: '99-103' },
  { size: 'XL', bust: '96-100', waist: '78-82', hips: '104-108' },
  { size: 'XXL', bust: '101-106', waist: '83-88', hips: '109-114' },
]

const SizeGuideScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('product.sizeGuide')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.body2, { color: colors.textSecondary, marginBottom: 24 }]}>
          All measurements are in centimetres (cm). For the best fit, measure yourself and compare with the chart below.
        </Text>

        <View style={[styles.table, { borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' }]}>
          <View style={[styles.row, { backgroundColor: colors.surface }]}>
            {['Size', 'Bust', 'Waist', 'Hips'].map(h => (
              <Text key={h} style={[styles.cell, typography.label, { color: colors.primary, textAlign: 'center' }]}>{h}</Text>
            ))}
          </View>
          {SIZE_DATA.map((row, i) => (
            <View key={row.size} style={[styles.row, { backgroundColor: i % 2 === 0 ? colors.background : colors.surface }]}>
              <Text style={[styles.cell, typography.label, { color: colors.primary, textAlign: 'center' }]}>{row.size}</Text>
              <Text style={[styles.cell, typography.body2, { color: colors.textSecondary, textAlign: 'center' }]}>{row.bust}</Text>
              <Text style={[styles.cell, typography.body2, { color: colors.textSecondary, textAlign: 'center' }]}>{row.waist}</Text>
              <Text style={[styles.cell, typography.body2, { color: colors.textSecondary, textAlign: 'center' }]}>{row.hips}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  table: { borderWidth: 1 },
  row: { flexDirection: 'row' },
  cell: { flex: 1, padding: 12 },
})

export default SizeGuideScreen
