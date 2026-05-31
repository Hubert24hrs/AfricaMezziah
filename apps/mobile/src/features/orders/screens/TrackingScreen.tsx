import React, { memo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetOrderTrackingQuery } from '@store/api/ordersApi'

const STEP_ICONS = ['📋', '📦', '🚚', '🏠', '✅']

const TrackingScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { orderId } = route.params ?? {}

  const { data: tracking } = useGetOrderTrackingQuery(orderId as string)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('orders.trackOrder')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        {tracking?.estimatedDelivery && (
          <View style={[styles.etaCard, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>Estimated Delivery</Text>
            <Text style={[typography.h3, { color: colors.primary }]}>
              {new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
          </View>
        )}

        <View style={[styles.timeline, { marginTop: 24 }]}>
          {(tracking?.steps ?? []).map((step, i) => (
            <View key={i} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.stepDot,
                  {
                    backgroundColor: step.completed ? colors.success : colors.surface,
                    borderColor: step.completed ? colors.success : colors.border,
                  },
                ]}>
                  <Text style={{ fontSize: 16 }}>{STEP_ICONS[i] ?? '📍'}</Text>
                </View>
                {i < (tracking?.steps.length ?? 0) - 1 && (
                  <View style={[styles.line, { backgroundColor: step.completed ? colors.success : colors.border }]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[typography.label, { color: step.completed ? colors.textPrimary : colors.textMuted }]}>
                  {step.label}
                </Text>
                {step.timestamp && (
                  <Text style={[typography.caption, { color: colors.textMuted }]}>
                    {new Date(step.timestamp).toLocaleString()}
                  </Text>
                )}
              </View>
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
  etaCard: { padding: 16, alignItems: 'center' },
  timeline: { gap: 0 },
  timelineItem: { flexDirection: 'row', gap: 16 },
  timelineLeft: { alignItems: 'center' },
  stepDot: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  line: { width: 2, flex: 1, marginVertical: 4 },
  timelineContent: { flex: 1, paddingTop: 12, paddingBottom: 24 },
})

export default TrackingScreen
