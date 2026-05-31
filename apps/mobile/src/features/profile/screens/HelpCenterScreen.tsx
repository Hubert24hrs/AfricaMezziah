import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'

const FAQ = [
  { q: 'How do I track my order?', a: 'Go to Profile → My Orders → Track Order on your order.' },
  { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery for unworn items in original packaging.' },
  { q: 'How long does shipping take?', a: 'Standard: 5-7 business days. Express: 2-3 business days.' },
  { q: 'What payment methods are accepted?', a: 'We accept Paystack, Flutterwave, Stripe, bank transfer, and cash on delivery.' },
  { q: 'How do I change my address?', a: 'Go to Profile → Addresses to add, edit, or delete delivery addresses.' },
  { q: 'Is my payment information secure?', a: 'Yes. We never store your card details. Payments are processed securely via Paystack and Stripe.' },
]

const HelpCenterScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const filtered = FAQ.filter(f => !query || f.q.toLowerCase().includes(query.toLowerCase()))

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('profile.helpCenter')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.search, { marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.full, borderColor: colors.border }]}>
        <Text>🔍 </Text>
        <TextInput
          style={[styles.searchInput, typography.body2, { color: colors.textPrimary }]}
          placeholder="Search FAQ..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.faq, { backgroundColor: colors.surface, borderRadius: radius.lg }]}
            onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <View style={styles.faqQuestion}>
              <Text style={[typography.body1, { color: colors.textPrimary, flex: 1 }]}>{item.q}</Text>
              <Text style={{ color: colors.textMuted }}>{expandedIndex === index ? '−' : '+'}</Text>
            </View>
            {expandedIndex === index && (
              <Text style={[typography.body2, { color: colors.textSecondary, marginTop: 8 }]}>{item.a}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  search: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderWidth: 1, marginBottom: 8 },
  searchInput: { flex: 1 },
  faq: { padding: 16 },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', gap: 8 },
})

export default HelpCenterScreen
