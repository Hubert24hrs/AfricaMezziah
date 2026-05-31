import React, { memo, useState, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useSendMessageMutation } from '@store/api/aiApi'
import { ROUTES } from '@constants/routes'
import ProductCard from '@shared/components/ProductCard'
import type { ChatMessage, ChatResponse } from '../ai.types'

const QUICK_REPLIES = [
  'Suggest an outfit for a wedding',
  'What\'s trending in African fashion?',
  'Show me Ankara dresses under ₦20,000',
  'Help me style this piece',
]

interface Message extends ChatMessage {
  id: string
  products?: ChatResponse['products']
  isLoading?: boolean
}

const AIAssistantScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello! I\'m your AI Fashion Stylist. I can help you find the perfect outfit, suggest styles, and discover new trends. What are you looking for today? ✨',
    },
  ])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [sendMessage, { isLoading }] = useSendMessageMutation()
  const flatListRef = useRef<FlatList>(null)

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
      const loadingMsg: Message = { id: `loading-${Date.now()}`, role: 'assistant', content: '', isLoading: true }
      setMessages(prev => [...prev, userMsg, loadingMsg])
      setInput('')

      try {
        const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        const result = await sendMessage({ messages: allMessages, sessionId }).unwrap()
        setSessionId(result.sessionId)
        setMessages(prev =>
          prev
            .filter(m => !m.isLoading)
            .concat({
              id: `reply-${Date.now()}`,
              role: 'assistant',
              content: result.reply,
              products: result.products,
            }),
        )
      } catch {
        setMessages(prev =>
          prev
            .filter(m => !m.isLoading)
            .concat({ id: `err-${Date.now()}`, role: 'assistant', content: t('common.error') }),
        )
      }
    },
    [messages, sessionId, sendMessage, t],
  )

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <View style={[styles.messageRow, item.role === 'user' && styles.userRow]}>
        {item.role === 'assistant' && <Text style={styles.aiAvatar}>🤖</Text>}
        <View style={{ maxWidth: '80%' }}>
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: item.role === 'user' ? colors.primary : colors.surface,
                borderRadius: item.role === 'user' ? `${radius.xl}px ${radius.xl}px 4px ${radius.xl}px` as unknown as number : radius.xl,
              },
            ]}
          >
            {item.isLoading ? (
              <Text style={[typography.body2, { color: colors.textMuted }]}>Thinking...</Text>
            ) : (
              <Text style={[typography.body2, { color: item.role === 'user' ? colors.textInverse : colors.textPrimary }]}>
                {item.content}
              </Text>
            )}
          </View>
          {item.products && item.products.length > 0 && (
            <FlatList
              data={item.products.slice(0, 4)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={p => p.id}
              style={{ marginTop: 8 }}
              renderItem={({ item: product }) => (
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: product.id })
                  }}
                />
              )}
            />
          )}
        </View>
      </View>
    ),
    [colors, typography, radius, navigation],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.aiIcon}>✨</Text>
          <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('ai.title')}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
          renderItem={renderMessage}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Quick replies */}
        <FlatList
          data={QUICK_REPLIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.quickReply, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.full }]}
              onPress={() => { void handleSend(item) }}
            >
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.textInput, typography.body1, { color: colors.textPrimary }]}
            placeholder={t('ai.placeholder')}
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.surface }]}
            onPress={() => { void handleSend(input) }}
            disabled={!input.trim() || isLoading}
          >
            <Text style={{ color: input.trim() ? colors.textInverse : colors.textMuted, fontSize: 20 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiIcon: { fontSize: 20 },
  messageRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiAvatar: { fontSize: 28, width: 36 },
  bubble: { padding: 12 },
  quickReply: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8, borderTopWidth: 1 },
  textInput: { flex: 1, maxHeight: 120, paddingVertical: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
})

export default AIAssistantScreen
