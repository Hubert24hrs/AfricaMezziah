import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import Button from '@shared/components/Button'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQSection {
  title: string
  items: FAQItem[]
}

const FAQ_DATA: FAQSection[] = [
  {
    title: 'General',
    items: [
      { question: 'What is Africa Mezziah?', answer: 'Africa Mezziah is a premium African fashion e-commerce platform connecting you with authentic African designers and fashion brands.' },
      { question: 'How do I create an account?', answer: 'Download the app, tap Sign Up, fill in your details and verify your email or phone number.' },
    ],
  },
  {
    title: 'Orders',
    items: [
      { question: 'How do I track my order?', answer: 'Go to Profile → My Orders → tap your order → Track Order to see real-time tracking.' },
      { question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 2 hours of placement if not yet shipped. Contact support for assistance.' },
    ],
  },
  {
    title: 'Payments',
    items: [
      { question: 'What payment methods are supported?', answer: 'We support Paystack, Flutterwave, bank transfers, digital wallets, and cash on delivery in select areas.' },
      { question: 'Is my payment information secure?', answer: 'Yes. We never store card details — all payments are tokenized via our payment partners.' },
    ],
  },
  {
    title: 'Returns',
    items: [
      { question: 'What is the return policy?', answer: 'Items can be returned within 14 days of delivery if unused and in original packaging.' },
      { question: 'How do I initiate a return?', answer: 'Go to Orders → select the order → Request Return, select items and reason.' },
    ],
  },
  {
    title: 'Account',
    items: [
      { question: 'How do I change my password?', answer: 'Go to Profile → Security Settings → Change Password.' },
      { question: 'How do I delete my account?', answer: 'Go to Profile → Privacy Settings → Delete Account. This cannot be undone.' },
    ],
  },
]

interface FAQItemRowProps {
  item: FAQItem
  colors: ReturnType<typeof useTheme>['colors']
}

const FAQItemRow: React.FC<FAQItemRowProps> = memo(({ item, colors }) => {
  const [expanded, setExpanded] = useState(false)

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(prev => !prev)
  }, [])

  return (
    <TouchableOpacity
      style={[faqStyles.item, { borderBottomColor: colors.border }]}
      onPress={toggle}
      activeOpacity={0.75}
    >
      <View style={faqStyles.questionRow}>
        <Text style={[faqStyles.question, { color: colors.textPrimary }]}>{item.question}</Text>
        <Text style={[faqStyles.chevron, { color: colors.primary }]}>
          {expanded ? '−' : '+'}
        </Text>
      </View>
      {expanded && (
        <Text style={[faqStyles.answer, { color: colors.textSecondary }]}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  )
})

const faqStyles = StyleSheet.create({
  item: { paddingVertical: 14, borderBottomWidth: 1 },
  questionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  question: { flex: 1, fontFamily: 'Poppins-Medium', fontSize: 14, lineHeight: 20 },
  chevron: { fontSize: 22, fontWeight: '700', width: 24, textAlign: 'center' },
  answer: { fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 10, lineHeight: 20 },
})

/** Help center with search bar, FAQ accordion, and contact support */
const HelpCenterScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA
    const q = searchQuery.toLowerCase()
    return FAQ_DATA.map(section => ({
      ...section,
      items: section.items.filter(
        item => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
      ),
    })).filter(s => s.items.length > 0)
  }, [searchQuery])

  const handleEmailSupport = useCallback(() => {
    Linking.openURL('mailto:support@africamezziah.com?subject=Help%20Request')
  }, [])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('help.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder={t('help.searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
        </View>

        {/* FAQ Sections */}
        {filteredSections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, i) => (
              <FAQItemRow key={i} item={item} colors={colors} />
            ))}
          </View>
        ))}

        {filteredSections.length === 0 && (
          <View style={styles.noResults}>
            <Text style={[styles.noResultsText, { color: colors.textMuted }]}>{t('help.noResults')}</Text>
          </View>
        )}

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>{t('help.stillNeedHelp')}</Text>
          <Text style={[styles.contactDesc, { color: colors.textSecondary }]}>{t('help.contactDesc')}</Text>
          <View style={styles.contactButtons}>
            <Button
              title={t('help.emailSupport')}
              onPress={handleEmailSupport}
              style={styles.contactBtn}
            />
            <Button
              title={t('help.liveChat')}
              onPress={() => {}}
              variant="secondary"
              style={styles.contactBtn}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backText: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary },
    headerTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    scroll: { flex: 1 },
    searchSection: { paddingHorizontal: 20, paddingVertical: 16 },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 14,
      height: 48,
      gap: 10,
    },
    searchIcon: { fontSize: 16 },
    input: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 15 },
    section: {
      paddingHorizontal: 20,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 8,
    },
    sectionTitle: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
      color: colors.primary,
      marginBottom: 4,
      paddingTop: 12,
    },
    noResults: { paddingVertical: 40, alignItems: 'center' },
    noResultsText: { fontFamily: 'Poppins-Regular', fontSize: 15 },
    contactSection: { paddingHorizontal: 20, paddingVertical: 28, alignItems: 'center' },
    contactTitle: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: colors.textPrimary, marginBottom: 8, textAlign: 'center' },
    contactDesc: { fontFamily: 'Poppins-Regular', fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
    contactButtons: { flexDirection: 'row', gap: 12, width: '100%' },
    contactBtn: { flex: 1 },
  })

export default HelpCenterScreen
