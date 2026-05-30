import React, { memo, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useTheme } from '@shared/hooks/useTheme'
import ProductCard from '@shared/components/ProductCard'
import type { Product } from '@store/api/productsApi'

interface FlashSaleStripProps {
  endTime: string
  products: Product[]
  onProductPress: (id: string) => void
}

const FlashSaleStrip: React.FC<FlashSaleStripProps> = memo(({ endTime, products, onProductPress }) => {
  const { colors } = useTheme()
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const end = new Date(endTime).getTime()
    const update = () => {
      const diff = end - Date.now()
      if (diff <= 0) { setTimeLeft('00:00:00'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  return (
    <View>
      <View style={[styles.header, { backgroundColor: colors.accent }]}>
        <Text style={styles.headerTitle}>⚡ Flash Sale</Text>
        <View style={styles.timerRow}>
          <Text style={styles.timerLabel}>Ends in </Text>
          <Text style={styles.timer}>{timeLeft}</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {products.map(p => (
          <View key={p.id} style={styles.cardWrap}>
            <ProductCard product={p} onPress={() => onProductPress(p.id)} />
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  headerTitle: { color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  timerRow: { flexDirection: 'row', alignItems: 'center' },
  timerLabel: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Poppins-Regular', fontSize: 13 },
  timer: { color: '#fff', fontFamily: 'Inter-Bold', fontSize: 15, letterSpacing: 1 },
  list: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  cardWrap: { width: 160 },
})

export default FlashSaleStrip
