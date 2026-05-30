import React, { memo, useState, useCallback, useRef } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'
import { useChatMutation } from '@store/api/aiApi'
import { formatCurrency } from '@shared/utils/formatCurrency'
import { ROUTES } from '@shared/constants/routes'

interface Message { id: string; role: 'user' | 'assistant'; content: string; products?: any[] }

const QUICK_REPLIES = ['Outfit ideas for me', "What's trending?", 'Help me for an occasion', 'Deals under ₦10,000']

const AIAssistantScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [chat, { isLoading }] = useChatMutation()
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: 'Hi! I am your personal African fashion stylist. How can I help you today?' },
  ])
  const [input, setInput] = useState('')
  const listRef = useRef<FlatList>(null)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(msgs => [...msgs, userMsg])
    setInput('')
    try {
      const res = await chat({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }).unwrap()
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: res.reply, products: res.products }
      setMessages(msgs => [...msgs, assistantMsg])
    } catch {
      setMessages(msgs => [...msgs, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an issue. Please try again.' }])
    }
  }, [chat, messages])

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>AI Stylist</Text>
        <Ionicons name="sparkles" size={20} color={colors.primary} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble, { backgroundColor: item.role === 'user' ? colors.primary : colors.surface }]}>
              <Text style={[styles.bubbleText, { color: item.role === 'user' ? '#0F0F1A' : colors.textPrimary }]}>{item.content}</Text>
              {item.products && item.products.length > 0 && (
                <View style={styles.productsRow}>
                  {item.products.slice(0, 3).map((p: any) => (
                    <TouchableOpacity key={p.id} style={[styles.productCard, { backgroundColor: colors.background }]} onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: p.id })}>
                      <FastImage source={{ uri: p.images?.[0] }} style={styles.productImage} resizeMode={FastImage.resizeMode.cover} />
                      <Text style={[styles.productName, { color: colors.textPrimary }]} numberOfLines={1}>{p.name}</Text>
                      <Text style={[styles.productPrice, { color: colors.primary }]}>{formatCurrency(p.price, p.currency)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        />

        {messages.length <= 1 && (
          <View style={styles.quickReplies}>
            {QUICK_REPLIES.map(qr => (
              <TouchableOpacity key={qr} style={[styles.qrChip, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => sendMessage(qr)}>
                <Text style={[styles.qrText, { color: colors.textSecondary }]}>{qr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.inputRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, fontFamily: 'Poppins-Regular' }]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask me about styles, outfits..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity onPress={() => sendMessage(input)} disabled={isLoading || !input.trim()} style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.border }]}>
            <Ionicons name={isLoading ? 'hourglass' : 'send'} size={18} color="#0F0F1A" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
  messageList: { padding: 16, gap: 12 },
  bubble: { maxWidth: '85%', borderRadius: 16, padding: 12 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  bubbleText: { fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 21 },
  productsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  productCard: { width: 90, borderRadius: 8, overflow: 'hidden', padding: 4 },
  productImage: { width: '100%', height: 80, borderRadius: 6 },
  productName: { fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 4 },
  productPrice: { fontFamily: 'Inter-Bold', fontSize: 11 },
  quickReplies: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  qrChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  qrText: { fontFamily: 'Poppins-Regular', fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, gap: 8 },
  input: { flex: 1, fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
})

export default AIAssistantScreen
