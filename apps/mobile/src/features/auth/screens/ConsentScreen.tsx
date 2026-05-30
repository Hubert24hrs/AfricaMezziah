import React, { memo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { giveConsent } from '@features/auth/authSlice'
import { initAnalytics } from '@services/analyticsService'
import { ROUTES } from '@shared/constants/routes'
import Button from '@shared/components/Button'

const ConsentScreen: React.FC = memo(() => {
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()

  const handleAccept = () => {
    dispatch(giveConsent())
    initAnalytics(true)
    navigation.replace(ROUTES.LOGIN)
  }

  const handleDecline = () => {
    initAnalytics(false)
    dispatch(giveConsent())
    navigation.replace(ROUTES.LOGIN)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy & Consent</Text>
        <Text style={styles.body}>
          Africa Mezziah collects certain data to provide you with a personalized shopping experience. We collect:{'\n\n'}
          • Account information (name, email, phone){'\n'}
          • Shopping activity and preferences{'\n'}
          • Device information for security{'\n'}
          • Location for delivery purposes{'\n\n'}
          We never sell your data. You can withdraw consent at any time in Privacy Settings.
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Accept & Continue" onPress={handleAccept} fullWidth />
        <TouchableOpacity onPress={handleDecline} style={styles.decline}>
          <Text style={styles.declineText}>Decline non-essential data</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  content: { padding: 24, paddingTop: 80 },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: '#C9A84C', marginBottom: 24 },
  body: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#B0B0C3', lineHeight: 24 },
  footer: { padding: 24, gap: 12 },
  decline: { alignItems: 'center', padding: 12 },
  declineText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#6B6B80' },
})

export default ConsentScreen
