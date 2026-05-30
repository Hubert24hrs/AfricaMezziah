import React, { memo, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProductReviewsQuery } from '@store/api/productsApi'
import Skeleton from '@shared/components/Skeleton'
import { formatRelativeDate } from '@shared/utils/formatDate'

const ReviewsScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { productId } = route.params ?? {}
  const { data, isLoading } = useGetProductReviewsQuery({ id: productId })

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>
      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[1,2,3].map(i => <Skeleton key={i} height={100} borderRadius={12} />)}
        </View>
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.userName, { color: colors.textPrimary }]}>{item.user.name}</Text>
                <View style={styles.stars}>
                  {[1,2,3,4,5].map(i => <Ionicons key={i} name={i <= item.rating ? 'star' : 'star-outline'} size={12} color={colors.primary} />)}
                </View>
              </View>
              <Text style={[styles.reviewTitle, { color: colors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>{item.body}</Text>
              <Text style={[styles.date, { color: colors.textMuted }]}>{formatRelativeDate(item.createdAt)}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  userName: { fontFamily: 'Poppins-SemiBold', fontSize: 14 },
  stars: { flexDirection: 'row' },
  reviewTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 13, marginBottom: 4 },
  body: { fontFamily: 'Poppins-Regular', fontSize: 13, lineHeight: 20 },
  date: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 8 },
})

export default ReviewsScreen
