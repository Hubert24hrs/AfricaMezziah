import React, { memo, useState, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { MMKV } from 'react-native-mmkv'
import { useTheme } from '@shared/hooks/useTheme'
import { ROUTES } from '@constants/routes'

const storage = new MMKV({ id: 'search-history' })
const TRENDING = ['Ankara dress', 'Kente suit', 'African print', 'Dashiki', 'Agbada', 'Headwrap']

const SearchScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const recentsRaw = storage.getString('recents')
  const recents: string[] = recentsRaw ? (JSON.parse(recentsRaw) as string[]) : []

  const handleSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return
      const updated = [q, ...recents.filter(r => r !== q)].slice(0, 10)
      storage.set('recents', JSON.stringify(updated))
      // @ts-ignore
      navigation.navigate(ROUTES.SEARCH_RESULTS, { q })
    },
    [navigation, recents],
  )

  const clearHistory = useCallback(() => {
    storage.delete('recents')
  }, [])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.searchRow, { paddingHorizontal: spacing.md }]}>
        <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderRadius: radius.full, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.input, typography.body1, { color: colors.textPrimary }]}
            placeholder={t('common.search')}
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ color: colors.textMuted, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={[typography.label, { color: colors.primary }]}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>

      {/* Camera / Voice */}
      <View style={[styles.quickActions, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity
          style={[styles.quickBtn, { backgroundColor: colors.surface, borderRadius: radius.md }]}
          // @ts-ignore
          onPress={() => navigation.navigate(ROUTES.VISUAL_SEARCH)}
        >
          <Text style={styles.quickIcon}>📷</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Visual Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text style={styles.quickIcon}>🎙️</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>Voice Search</Text>
        </TouchableOpacity>
      </View>

      {/* Trending */}
      <View style={{ paddingHorizontal: spacing.md, marginTop: 24 }}>
        <Text style={[typography.h4, { color: colors.textPrimary, marginBottom: 12 }]}>Trending</Text>
        <View style={styles.chips}>
          {TRENDING.map(term => (
            <TouchableOpacity
              key={term}
              style={[styles.chip, { backgroundColor: colors.surface, borderRadius: radius.full, borderColor: colors.border }]}
              onPress={() => handleSearch(term)}
            >
              <Text style={styles.trendIcon}>🔥</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent */}
      {recents.length > 0 && (
        <View style={{ paddingHorizontal: spacing.md, marginTop: 24 }}>
          <View style={styles.recentHeader}>
            <Text style={[typography.h4, { color: colors.textPrimary }]}>Recent</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={[typography.caption, { color: colors.accent }]}>Clear</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recents}
            keyExtractor={(item, i) => `${item}-${i}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recentItem} onPress={() => handleSearch(item)}>
                <Text style={{ color: colors.textMuted }}>🕐</Text>
                <Text style={[typography.body2, { color: colors.textSecondary, flex: 1, marginLeft: 12 }]}>{item}</Text>
                <Text style={[typography.caption, { color: colors.primary }]}>↗</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderWidth: 1 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1 },
  cancelBtn: { padding: 4 },
  quickActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  quickIcon: { fontSize: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, gap: 6 },
  trendIcon: { fontSize: 12 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
})

export default SearchScreen
