import React, { memo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shared/hooks/useTheme'
import { useRequestReturnMutation } from '@store/api/ordersApi'
import Button from '@shared/components/Button'

const REASONS = ['Wrong item received', 'Item damaged', 'Does not match description', 'Changed my mind', 'Quality issue']

const ReturnRequestScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { orderId } = route.params ?? {}
  const [requestReturn, { isLoading }] = useRequestReturnMutation()
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async () => {
    if (!reason) return
    try {
      await requestReturn({ orderId, items: [], reason, description }).unwrap()
      navigation.goBack()
    } catch {}
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Return Request</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Reason for Return</Text>
        {REASONS.map(r => (
          <TouchableOpacity key={r} style={[styles.option, { backgroundColor: colors.surface, borderColor: reason === r ? colors.primary : 'transparent', borderWidth: 1.5 }]} onPress={() => setReason(r)}>
            <Text style={[styles.optionText, { color: reason === r ? colors.primary : colors.textPrimary }]}>{r}</Text>
            {reason === r && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
          </TouchableOpacity>
        ))}
        <Text style={[styles.label, { color: colors.textPrimary, marginTop: 16 }]}>Additional Details</Text>
        <TextInput
          style={[styles.textarea, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
        />
        <Button label="Submit Return Request" onPress={handleSubmit} loading={isLoading} fullWidth style={{ marginTop: 24 }} disabled={!reason} />
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
  content: { padding: 16, gap: 8 },
  label: { fontFamily: 'Poppins-SemiBold', fontSize: 15, marginBottom: 4 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 10 },
  optionText: { fontFamily: 'Poppins-Regular', fontSize: 14 },
  textarea: { borderRadius: 10, borderWidth: 1, padding: 14, fontFamily: 'Poppins-Regular', fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
})

export default ReturnRequestScreen
