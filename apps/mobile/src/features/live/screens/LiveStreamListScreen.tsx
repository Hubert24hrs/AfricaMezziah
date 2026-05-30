import React, { memo, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetStreamsQuery } from '@store/api/liveApi'
import EmptyState from '@shared/components/EmptyState'
import { ROUTES } from '@shared/constants/routes'

const { width } = Dimensions.get('window')

const LiveStreamListScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data: streams } = useGetStreamsQuery({ status: 'live' })

  const handlePress = useCallback((id: string) => {
    navigation.navigate(ROUTES.LIVE_STREAM_VIEWER, { streamId: id })
  }, [navigation])

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Live Shopping</Text>
      {!streams?.length ? (
        <EmptyState title="No live streams" subtitle="Check back later for live shopping events" icon="videocam-outline" />
      ) : (
        <FlatList
          data={streams}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={() => handlePress(item.id)}>
              <FastImage source={{ uri: item.thumbnail }} style={styles.thumb} resizeMode={FastImage.resizeMode.cover} />
              <View style={[styles.liveBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.streamTitle, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.host, { color: colors.textMuted }]}>{item.hostName}</Text>
                <View style={styles.viewers}>
                  <Ionicons name="eye" size={12} color={colors.textMuted} />
                  <Text style={[styles.viewerCount, { color: colors.textMuted }]}>{item.viewerCount} watching</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 20, padding: 16 },
  list: { padding: 16, gap: 16 },
  card: { borderRadius: 14, overflow: 'hidden' },
  thumb: { width: '100%', height: 200 },
  liveBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  liveText: { fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#fff', letterSpacing: 1 },
  info: { padding: 12 },
  streamTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15, marginBottom: 4 },
  host: { fontFamily: 'Poppins-Regular', fontSize: 13, marginBottom: 6 },
  viewers: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewerCount: { fontFamily: 'Inter-Regular', fontSize: 12 },
})

export default LiveStreamListScreen
