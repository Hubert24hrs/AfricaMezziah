import React, { memo } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ROUTES } from '@shared/constants/routes'
import { SUPPORTED_LANGUAGES, changeLanguage } from '@i18n/index'

const LanguageSelectionScreen: React.FC = memo(() => {
  const navigation = useNavigation<any>()

  const handleSelect = async (code: string) => {
    await changeLanguage(code)
    navigation.replace(ROUTES.CONSENT)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      <Text style={styles.subtitle}>Choose your preferred language</Text>
      <FlatList
        data={SUPPORTED_LANGUAGES}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.code)}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemNative}>{item.nativeLabel}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingTop: 80 },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: '#C9A84C', textAlign: 'center' },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#B0B0C3', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  list: { paddingHorizontal: 24 },
  item: { backgroundColor: '#16213E', borderRadius: 12, padding: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#FFFFFF' },
  itemNative: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#B0B0C3' },
})

export default LanguageSelectionScreen
