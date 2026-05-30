import React, { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTES } from '@shared/constants/routes'
import LiveStreamListScreen from '@features/live/screens/LiveStreamListScreen'
import LiveStreamViewerScreen from '@features/live/screens/LiveStreamViewerScreen'

const Stack = createNativeStackNavigator()
const LiveStackNavigator: React.FC = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.LIVE_STREAM_LIST} component={LiveStreamListScreen} />
    <Stack.Screen name={ROUTES.LIVE_STREAM_VIEWER} component={LiveStreamViewerScreen} options={{ animation: 'slide_from_bottom' }} />
  </Stack.Navigator>
))
export default LiveStackNavigator
