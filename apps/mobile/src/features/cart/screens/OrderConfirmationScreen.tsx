import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { ROUTES } from '@constants/routes'
import Button from '@shared/components/Button'
import { disableScreenshotPrevention } from '@services/securityService'

const OrderConfirmationScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing, radius } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  // @ts-ignore
  const { orderId } = route.params ?? {}

  const handleTrackOrder = useCallback(() => {
    void disableScreenshotPrevention()
    // @ts-ignore
    navigation.navigate(ROUTES.TRACKING, { orderId })
  }, [navigation, orderId])

  const handleContinue = useCallback(() => {
    void disableScreenshotPrevention()
    // @ts-ignore
    navigation.navigate(ROUTES.TAB_HOME)
  }, [navigation])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <LottieView
        source={require('@assets/animations/confetti.json')}
        autoPlay
        loop={false}
        style={styles.confetti}
      />

      <View style={styles.content}>
        <LottieView
          source={require('@assets/animations/success-check.json')}
          autoPlay
          loop={false}
          style={styles.checkmark}
        />

        <Text style={[typography.h2, { color: colors.textPrimary, textAlign: 'center', marginTop: 24 }]}>
          {t('checkout.orderPlaced')}
        </Text>
        <Text style={[typography.body1, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
          {t('checkout.orderSuccess')}
        </Text>
        <Text style={[typography.h4, { color: colors.primary, marginTop: 16 }]}>
          {t('checkout.orderNumber', { number: orderId ?? '000001' })}
        </Text>
        <Text style={[typography.body2, { color: colors.textSecondary, marginTop: 8 }]}>
          {t('checkout.estimatedDelivery', { date: '5-7 business days' })}
        </Text>

        <Button
          label={t('checkout.trackOrder')}
          onPress={handleTrackOrder}
          variant="primary"
          style={styles.btn}
        />
        <Button
          label={t('checkout.continueShopping')}
          onPress={handleContinue}
          variant="ghost"
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  confetti: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, zIndex: 1 },
  checkmark: { width: 120, height: 120 },
  btn: { width: '100%', marginTop: 12 },
})

export default OrderConfirmationScreen
