import React, { memo, useState, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetStreamByIdQuery, useSendChatMessageMutation } from '@store/api/liveApi'
import { ROUTES } from '@constants/routes'

const { width, height } = Dimensions.get('window')

const LiveStreamViewerScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { streamId } = route.params ?? {}

  const { data: stream } = useGetStreamByIdQuery(streamId as string)
  const [sendChat] = useSendChatMessageMutation()
  const [chatInput, setChatInput] = useState('')
  const [showProducts, setShowProducts] = useState(false)

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || !streamId) return
    await sendChat({ streamId: streamId as string, message: chatInput })
    setChatInput('')
  }, [chatInput, streamId, sendChat])

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      {/* Video Player Area */}
      <View style={styles.videoArea}>
        <Text style={[typography.body2, { color: '#FFF', textAlign: 'center' }]}>
          📺 Live Stream Player{'\n'}(react-native-video)
        </Text>
      </View>

      {/* Overlay Controls */}
      <SafeAreaView style={styles.overlay} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>✕</Text>
          </TouchableOpacity>
          <View style={styles.streamInfo}>
            <View style={[styles.livePill, { backgroundColor: colors.error }]}>
              <Text style={[typography.overline, { color: '#FFF' }]}>LIVE</Text>
            </View>
            <Text style={[typography.caption, { color: '#FFF' }]}>
              {stream?.viewerCount ?? 0} watching
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.productsBtn, { backgroundColor: `${colors.primary}CC` }]}
            onPress={() => setShowProducts(prev => !prev)}
          >
            <Text style={{ color: '#FFF' }}>🛒</Text>
          </TouchableOpacity>
        </View>

        {/* Chat */}
        <KeyboardAvoidingView style={styles.chatSection} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            data={stream?.chatMessages ?? []}
            keyExtractor={item => item.id}
            style={styles.chatList}
            renderItem={({ item }) => (
              <View style={styles.chatMsg}>
                <Text style={[typography.caption, { color: colors.primary }]}>{item.userName}: </Text>
                <Text style={[typography.caption, { color: '#FFF' }]}>{item.message}</Text>
              </View>
            )}
          />

          <View style={styles.chatInput}>
            <TextInput
              style={[styles.chatTextInput, typography.body2, { color: '#FFF' }]}
              placeholder={t('live.sendMessage')}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: colors.primary }]}
              onPress={() => { void handleSendChat() }}
            >
              <Text style={{ color: '#FFF' }}>↑</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Product Tray */}
      {showProducts && stream?.products && (
        <View style={[styles.productTray, { backgroundColor: `${colors.surface}EE` }]}>
          <FlatList
            data={stream.products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 12, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.productCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}
                // @ts-ignore
                onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })}
              >
                <Text style={[typography.caption, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[typography.label, { color: colors.primary }]}>₦{item.price.toLocaleString()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  videoArea: { width, height: height * 0.65, alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 18 },
  streamInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  livePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  productsBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  chatSection: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' },
  chatList: { flex: 1, paddingHorizontal: 12 },
  chatMsg: { flexDirection: 'row', marginBottom: 4, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 6 },
  chatInput: { flexDirection: 'row', padding: 8, gap: 8, backgroundColor: 'rgba(0,0,0,0.5)' },
  chatTextInput: { flex: 1, color: '#FFF', paddingVertical: 8 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  productTray: { position: 'absolute', bottom: 80, left: 0, right: 0, height: 120 },
  productCard: { width: 120, height: 96, padding: 8, justifyContent: 'space-between' },
})

export default LiveStreamViewerScreen
