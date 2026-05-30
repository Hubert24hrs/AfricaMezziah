import React, { memo, useState, useCallback } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetStreamQuery, useSendChatMutation } from '@store/api/liveApi'
import { formatCurrency } from '@shared/utils/formatCurrency'
import FastImage from 'react-native-fast-image'

const { width, height } = Dimensions.get('window')

const LiveStreamViewerScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { streamId } = route.params ?? {}
  const { data: stream } = useGetStreamQuery(streamId)
  const [sendChat] = useSendChatMutation()
  const [chatInput, setChatInput] = useState('')

  const handleSend = useCallback(async () => {
    if (!chatInput.trim()) return
    await sendChat({ streamId, message: chatInput })
    setChatInput('')
  }, [chatInput, sendChat, streamId])

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={styles.video}>
        <Text style={[styles.videoPlaceholder, { color: colors.textMuted }]}>Live Video Stream</Text>
      </View>

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.liveBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View style={styles.viewers}>
            <Ionicons name="eye" size={14} color="#fff" />
            <Text style={styles.viewerCount}>{stream?.viewerCount ?? 0}</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <FlatList
            data={stream?.products ?? []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={p => p.id}
            contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View style={[styles.productCard, { backgroundColor: 'rgba(22,33,62,0.9)' }]}>
                <FastImage source={{ uri: item.images[0] }} style={styles.productImg} resizeMode={FastImage.resizeMode.cover} />
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>{formatCurrency(item.price, item.currency)}</Text>
              </View>
            )}
          />

          <View style={styles.chatInput}>
            <TextInput
              style={[styles.input, { color: '#fff', fontFamily: 'Poppins-Regular' }]}
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="Say something..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={handleSend} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="send" size={16} color="#0F0F1A" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  video: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  videoPlaceholder: { fontFamily: 'Poppins-Regular', fontSize: 14 },
  overlay: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  closeBtn: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 999, padding: 6 },
  liveBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  liveText: { fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#fff', letterSpacing: 1 },
  viewers: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  viewerCount: { fontFamily: 'Inter-Bold', fontSize: 13, color: '#fff' },
  bottomSection: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12 },
  productCard: { width: 100, borderRadius: 10, overflow: 'hidden', padding: 6 },
  productImg: { width: '100%', height: 80, borderRadius: 6 },
  productName: { fontFamily: 'Poppins-Regular', fontSize: 10, color: '#fff', marginTop: 4 },
  productPrice: { fontFamily: 'Inter-Bold', fontSize: 11, color: '#C9A84C' },
  chatInput: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  input: { flex: 1, fontSize: 14 },
  sendBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
})

export default LiveStreamViewerScreen
