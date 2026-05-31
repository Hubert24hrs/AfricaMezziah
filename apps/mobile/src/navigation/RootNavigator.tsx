import React, { memo } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAppSelector } from '@store/store'
import AuthNavigator from './AuthNavigator'
import MainTabNavigator from './MainTabNavigator'

const Stack = createNativeStackNavigator()

const RootNavigator: React.FC = memo(() => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const isSecurityBlocked = useAppSelector(state => state.app.isSecurityBlocked)

  if (isSecurityBlocked) {
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
})

export default RootNavigator
