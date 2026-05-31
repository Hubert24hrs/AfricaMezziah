import React from 'react'
import { View, Text } from 'react-native'
const MapView: React.FC<Record<string, unknown>> = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#C9A84C' }}>🗺️ Map View</Text>
    {children as React.ReactNode}
  </View>
)
export default MapView
export const Marker: React.FC<Record<string, unknown>> = () => null
export const Polyline: React.FC<Record<string, unknown>> = () => null
