import React from 'react'
import { View, Text } from 'react-native'
const Video: React.FC<Record<string, unknown>> = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
    <Text style={{ color: '#fff' }}>📺 Video Player</Text>
  </View>
)
export default Video
