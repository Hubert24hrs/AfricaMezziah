import React, { memo } from 'react'
import { Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@shared/hooks/useTheme'

const ThreeDViewerScreen: React.FC = memo(() => {
  const { colors } = useTheme()
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#000' }]}>
      <Text style={[styles.text, { color: colors.primary }]}>3D Viewer</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>expo-three + Three.js integration</Text>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 24 },
  sub: { fontFamily: 'Poppins-Regular', fontSize: 13, marginTop: 8 },
})

export default ThreeDViewerScreen
