import React, { memo } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'
import AuthNavigator from './AuthNavigator'
import MainTabNavigator from './MainTabNavigator'

const Stack = createNativeStackNavigator()

const RootNavigator: React.FC = memo(() => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const onboardingComplete = useSelector((state: RootState) => state.auth.onboardingComplete)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isAuthenticated || !onboardingComplete ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
})

export default RootNavigator
