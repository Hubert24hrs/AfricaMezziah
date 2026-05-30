import React, { memo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'

const SIZE_CHART = [
  { size: 'XS', chest: '80-84', waist: '60-64', hip: '84-88' },
  { size: 'S', chest: '84-88', waist: '64-68', hip: '88-92' },
  { size: 'M', chest: '88-92', waist: '68-72', hip: '92-96' },
  { size: 'L', chest: '92-96', waist: '72-76', hip: '96-100' },
  { size: 'XL', chest: '96-100', waist: '76-80', hip: '100-104' },
  { size: 'XXL', chest: '100-104', waist: '80-84', hip: '104-108' },
]

const SizeGuideScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Size Guide</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.table, { backgroundColor: colors.surface }]}>
          <View style={[styles.row, { backgroundColor: colors.primary + '20' }]}>
            {['Size', 'Chest', 'Waist', 'Hip'].map(h => (
              <Text key={h} style={[styles.th, { color: colors.primary }]}>{h}</Text>
            ))}
          </View>
          {SIZE_CHART.map(row => (
            <View key={row.size} style={[styles.row, { borderTopColor: colors.border }]}>
              <Text style={[styles.td, { color: colors.textPrimary }]}>{row.size}</Text>
              <Text style={[styles.td, { color: colors.textSecondary }]}>{row.chest}</Text>
              <Text style={[styles.td, { color: colors.textSecondary }]}>{row.waist}</Text>
              <Text style={[styles.td, { color: colors.textSecondary }]}>{row.hip}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.note, { color: colors.textMuted }]}>All measurements are in centimeters (cm)</Text>
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
  content: { padding: 16 },
  table: { borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 16, borderTopWidth: 1 },
  th: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 13, textAlign: 'center' },
  td: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 13, textAlign: 'center' },
  note: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 12, textAlign: 'center' },
})

export default SizeGuideScreen
