import React, { memo, useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shared/hooks/useTheme'
import ProductCard from '@shared/components/ProductCard'
import { ROUTES } from '@constants/routes'
import type { Product } from '@features/catalog/catalog.types'

interface FlashSaleStripProps {
  endsAt: string
  products: Product[]
}

const pad = (n: number) => String(n).padStart(2, '0')

const FlashSaleStrip: React.FC<FlashSaleStripProps> = memo(({ endsAt, products }) => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ h, m, s })
    }
    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [endsAt])

  const handlePress = useCallback(
    (id: string) => {
      // @ts-ignore
      navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: id })
    },
    [navigation],
  )

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.accent, paddingHorizontal: spacing.md }]}>
        <Text style={styles.flashIcon}>⚡</Text>
        <Text style={[typography.h4, { color: '#FFFFFF', flex: 1 }]}>{t('home.flashSale')}</Text>
        <Text style={[typography.caption, { color: 'rgba(255,255,255,0.8)', marginRight: 8 }]}>{t('home.flashSaleEnds')}</Text>
        <View style={styles.timerRow}>
          {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((unit, i) => (
            <React.Fragment key={i}>
              <View style={styles.timerBlock}>
                <Text style={[typography.price, styles.timerText]}>{unit}</Text>
              </View>
              {i < 2 && <Text style={[typography.h4, { color: '#FFFFFF' }]}>:</Text>}
            </React.Fragment>
          ))}
        </View>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm }}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            title={item.title}
            price={item.price}
            originalPrice={item.originalPrice}
            imageUrl={item.imageUrl}
            rating={item.rating}
            reviewCount={item.reviewCount}
            isFlashSale
            onPress={() => handlePress(item.id)}
          />
        )}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  flashIcon: { fontSize: 20, marginRight: 8 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerBlock: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  timerText: { color: '#FFFFFF', fontSize: 16 },
})

export default FlashSaleStrip
