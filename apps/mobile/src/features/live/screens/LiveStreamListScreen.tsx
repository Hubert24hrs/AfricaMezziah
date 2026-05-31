import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetStreamsQuery } from '@store/api/liveApi'
import { ROUTES } from '@constants/routes'
import EmptyState from '@shared/components/EmptyState'
import type { LiveStream } from '../live.types'

const LiveStreamListScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius, shadows } = useTheme()
  const navigation = useNavigation()
  const [tab, setTab] = useState<'live' | 'upcoming'>('live')
  const { data: streams } = useGetStreamsQuery({ status: tab })

  const renderStream = useCallback(
    ({ item }: { item: LiveStream }) => (
      <TouchableOpacity
        style={[styles.card, { borderRadius: radius.lg, overflow: 'hidden', ...shadows.card }]}
        // @ts-ignore
        onPress={() => navigation.navigate(ROUTES.LIVE_VIEWER, { streamId: item.id })}
        activeOpacity={0.9}
      >
        <FastImage source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} resizeMode={FastImage.resizeMode.cover} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.overlay}>
          {item.status === 'live' && (
            <View style={[styles.liveBadge, { backgroundColor: colors.error }]}>
              <Text style={[typography.overline, { color: '#FFF' }]}>{t('live.liveNow')}</Text>
            </View>
          )}
          <Text style={[typography.label, { color: '#FFF' }]} numberOfLines={2}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.8)' }]}>{item.hostName}</Text>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.8)' }]}>
              {t('live.viewers', { count: item.viewerCount })}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ),
    [colors, typography, radius, shadows, navigation, t],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[typography.h4, { color: colors.textPrimary, padding: spacing.md }]}>{t('live.title')}</Text>

      <View style={[styles.tabs, { paddingHorizontal: spacing.md, borderBottomColor: colors.border }]}>
        {(['live', 'upcoming'] as const).map(t2 => (
          <TouchableOpacity
            key={t2}
            style={[styles.tab, tab === t2 && { borderBottomColor: colors.primary }]}
            onPress={() => setTab(t2)}
          >
            <Text style={[typography.label, { color: tab === t2 ? colors.primary : colors.textMuted }]}>
              {t2 === 'live' ? t('live.liveNow') : t('live.upcoming')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(streams ?? []).length === 0 ? (
        <EmptyState emoji="📺" title={tab === 'live' ? 'No live streams right now' : 'No upcoming streams'} />
      ) : (
        <FlashList
          data={streams ?? []}
          estimatedItemSize={200}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.md } as any}
          renderItem={renderStream}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  card: { height: 200 },
  thumbnail: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, gap: 4 },
  liveBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
})

export default LiveStreamListScreen
