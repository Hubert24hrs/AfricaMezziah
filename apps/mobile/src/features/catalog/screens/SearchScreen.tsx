import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { MMKV } from 'react-native-mmkv'
import { useTheme } from '@shared/hooks/useTheme'
import { ROUTES } from '@shared/constants/routes'

const storage = new MMKV({ id: 'search-storage' })
const RECENTS_KEY = 'recent_searches'
const MAX_RECENTS = 10

const TRENDING_SEARCHES = [
  'Ankara dress',
  'Kente fabric',
  'African print',
  'Dashiki',
  'Agbada',
  'Kitenge',
  'African accessories',
]

function getRecents(): string[] {
  try {
    const raw = storage.getString(RECENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecent(query: string) {
  const existing = getRecents().filter(r => r !== query)
  const updated = [query, ...existing].slice(0, MAX_RECENTS)
  storage.set(RECENTS_KEY, JSON.stringify(updated))
}

/** Search screen with autocomplete, recent searches, trending, voice & visual search */
const SearchScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const inputRef = useRef<TextInput>(null)
  const [query, setQuery] = useState('')
  const [recents, setRecents] = useState<string[]>(getRecents())

  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), 200)
    return () => clearTimeout(timeout)
  }, [])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return
      saveRecent(searchQuery.trim())
      setRecents(getRecents())
      navigation.navigate(ROUTES.SEARCH_RESULTS, { query: searchQuery.trim() })
    },
    [navigation],
  )

  const handleClearRecents = useCallback(() => {
    storage.set(RECENTS_KEY, JSON.stringify([]))
    setRecents([])
  }, [])

  const handleVisualSearch = useCallback(() => {
    navigation.navigate(ROUTES.VISUAL_SEARCH)
  }, [navigation])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder={t('search.placeholder')}
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.75}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => { /* voice search */ }} activeOpacity={0.75} style={styles.iconBtn}>
          <Text style={styles.actionIcon}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleVisualSearch} activeOpacity={0.75} style={styles.iconBtn}>
          <Text style={styles.actionIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
        {/* Recent searches */}
        {recents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {t('search.recentSearches')}
              </Text>
              <TouchableOpacity onPress={handleClearRecents} activeOpacity={0.75}>
                <Text style={[styles.clearAll, { color: colors.textMuted }]}>{t('search.clearAll')}</Text>
              </TouchableOpacity>
            </View>
            {recents.map(recent => (
              <TouchableOpacity
                key={recent}
                style={styles.recentRow}
                onPress={() => handleSearch(recent)}
                activeOpacity={0.75}
              >
                <Text style={styles.recentIcon}>🕐</Text>
                <Text style={[styles.recentText, { color: colors.textSecondary }]}>{recent}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const updated = recents.filter(r => r !== recent)
                    storage.set(RECENTS_KEY, JSON.stringify(updated))
                    setRecents(updated)
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.removeText, { color: colors.textMuted }]}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Trending */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('search.trending')}
          </Text>
          <View style={styles.trendingChips}>
            {TRENDING_SEARCHES.map(term => (
              <TouchableOpacity
                key={term}
                style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleSearch(term)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, { color: colors.textSecondary }]}>🔥 {term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 8,
    },
    backArrow: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary, paddingHorizontal: 4 },
    inputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 12,
      height: 48,
      gap: 8,
    },
    searchIcon: { fontSize: 16 },
    input: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 15, height: 48 },
    clearIcon: { fontSize: 14, color: '#6B6B80', padding: 4 },
    iconBtn: { padding: 8 },
    actionIcon: { fontSize: 22 },
    body: { flex: 1 },
    section: { paddingHorizontal: 20, paddingTop: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16 },
    clearAll: { fontFamily: 'Poppins-Medium', fontSize: 13 },
    recentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    recentIcon: { fontSize: 16 },
    recentText: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 15 },
    removeText: { fontSize: 13, padding: 4 },
    trendingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    chipText: { fontFamily: 'Poppins-Regular', fontSize: 13 },
  })

export default SearchScreen
