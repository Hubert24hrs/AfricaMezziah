import React, { memo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetTrackingQuery } from '@store/api/ordersApi'

const TrackingScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { orderId } = route.params ?? {}
  const { data: tracking } = useGetTrackingQuery(orderId)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Track Order</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {tracking?.steps.map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.stepLeft}>
              <View style={[styles.dot, { backgroundColor: step.completed ? colors.success : colors.border }]} />
              {i < (tracking.steps.length - 1) && <View style={[styles.line, { backgroundColor: step.completed ? colors.success : colors.border }]} />}
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepStatus, { color: step.completed ? colors.textPrimary : colors.textMuted }]}>{step.status}</Text>
              <Text style={[styles.stepLocation, { color: colors.textMuted }]}>{step.location}</Text>
              {step.completed && <Text style={[styles.stepTime, { color: colors.textMuted }]}>{step.timestamp}</Text>}
            </View>
          </View>
        ))}
        {tracking?.estimatedDelivery && (
          <View style={[styles.etaCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={[styles.etaText, { color: colors.textPrimary }]}>Estimated Delivery: {tracking.estimatedDelivery}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
  content: { padding: 24 },
  step: { flexDirection: 'row', gap: 16 },
  stepLeft: { alignItems: 'center', width: 20 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  line: { flex: 1, width: 2, minHeight: 40, marginVertical: 4 },
  stepContent: { flex: 1, paddingBottom: 32 },
  stepStatus: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
  stepLocation: { fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 2 },
  stepTime: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 4 },
  etaCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 12, marginTop: 16 },
  etaText: { fontFamily: 'Poppins-Medium', fontSize: 14 },
})

export default TrackingScreen
