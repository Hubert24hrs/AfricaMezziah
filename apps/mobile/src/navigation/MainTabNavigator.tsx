import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'
import { useTheme } from '@shared/hooks/useTheme'
import HomeStackNavigator from './HomeStackNavigator'
import DiscoverStackNavigator from './DiscoverStackNavigator'
import LiveStackNavigator from './LiveStackNavigator'
import CartStackNavigator from './CartStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'
import { ROUTES } from '@shared/constants/routes'

const Tab = createBottomTabNavigator()

const CartBadge: React.FC<{ count: number }> = memo(({ count }) => {
  const { colors } = useTheme()
  if (count === 0) return null
  return (
    <View style={[styles.badge, { backgroundColor: colors.accent }]}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : String(count)}</Text>
    </View>
  )
})

const MainTabNavigator: React.FC = memo(() => {
  const { colors } = useTheme()
  const cartCount = useSelector((state: RootState) => state.cart?.itemCount ?? 0)

  const screenOptions = useCallback(({ route }: { route: { name: string } }) => ({
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      height: 60,
      paddingBottom: 8,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarLabelStyle: { fontFamily: 'Poppins-Medium', fontSize: 11 },
    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
      let iconName: keyof typeof Ionicons.glyphMap = 'home'
      if (route.name === ROUTES.HOME_TAB) iconName = focused ? 'home' : 'home-outline'
      else if (route.name === ROUTES.DISCOVER_TAB) iconName = focused ? 'search' : 'search-outline'
      else if (route.name === ROUTES.LIVE_TAB) iconName = focused ? 'play-circle' : 'play-circle-outline'
      else if (route.name === ROUTES.CART_TAB) iconName = focused ? 'cart' : 'cart-outline'
      else if (route.name === ROUTES.PROFILE_TAB) iconName = focused ? 'person' : 'person-outline'
      return <Ionicons name={iconName} size={24} color={color} />
    },
  }), [colors])

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name={ROUTES.HOME_TAB} component={HomeStackNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name={ROUTES.DISCOVER_TAB} component={DiscoverStackNavigator} options={{ tabBarLabel: 'Discover' }} />
      <Tab.Screen name={ROUTES.LIVE_TAB} component={LiveStackNavigator} options={{ tabBarLabel: 'Live' }} />
      <Tab.Screen
        name={ROUTES.CART_TAB}
        component={CartStackNavigator}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent, color: '#fff', fontSize: 10 },
        }}
      />
      <Tab.Screen name={ROUTES.PROFILE_TAB} component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  )
})

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: -4, right: -8, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#fff', fontSize: 10, fontFamily: 'Inter-Bold' },
})

export default MainTabNavigator
