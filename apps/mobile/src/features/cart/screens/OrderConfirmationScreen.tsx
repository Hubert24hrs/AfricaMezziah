import React, { memo, useCallback, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import LottieView from 'lottie-react-native'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetOrderQuery } from '@store/api/ordersApi'
import Button from '@shared/components/Button'
import { ROUTES } from '@shared/constants/routes'

type OrderConfirmationRouteParams = {
  OrderConfirmation: { orderId: string }
}

/** Order success screen with Lottie confetti, order ID, estimated delivery */
const OrderConfirmationScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<OrderConfirmationRouteParams, 'OrderConfirmation'>>()
  const { orderId } = route.params

  const { data: order } = useGetOrderQuery(orderId)

  const handleContinueShopping = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME_TAB }] })
  }, [navigation])

  const handleViewOrder = useCallback(() => {
    navigation.navigate(ROUTES.ORDER_DETAIL, { orderId })
  }, [navigation, orderId])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Lottie Confetti */}
        <LottieView
          source={require('@assets/animations/confetti.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />

        <View style={styles.card}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>{t('order.confirmationTitle')}</Text>
          <Text style={styles.successSubtitle}>{t('order.confirmationSubtitle')}</Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('order.orderId')}</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>#{orderId.slice(-8).toUpperCase()}</Text>
          </View>

          {order?.estimatedDelivery && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('order.estimatedDelivery')}</Text>
              <Text style={styles.infoValue}>{order.estimatedDelivery}</Text>
            </View>
          )}

          {order?.total && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('order.total')}</Text>
              <Text style={[styles.infoValue, { color: colors.primary, fontFamily: 'Inter-Bold' }]}>
                ₦{order.total.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          title={t('order.viewOrder')}
          onPress={handleViewOrder}
          style={styles.viewOrderBtn}
        />
        <Button
          title={t('order.continueShopping')}
          onPress={handleContinueShopping}
          variant="secondary"
          style={styles.continueBtn}
        />
      </View>
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    lottie: { width: 250, height: 250, position: 'absolute', top: '10%' },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 28,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      width: '100%',
    },
    successIcon: { fontSize: 56, marginBottom: 16 },
    successTitle: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 26,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    successSubtitle: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    divider: { height: 1, width: '100%', marginBottom: 20 },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 12,
    },
    infoLabel: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textSecondary },
    infoValue: { fontFamily: 'Inter-Regular', fontSize: 14, color: colors.textPrimary },
    buttons: { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
    viewOrderBtn: {},
    continueBtn: {},
  })

export default OrderConfirmationScreen
