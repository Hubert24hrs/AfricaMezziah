import React, { memo, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme } from '@shared/hooks/useTheme'
import { ROUTES } from '@constants/routes'
import { useAppSelector } from '@store/store'

// Home Stack
import HomeScreen from '@features/home/screens/HomeScreen'
import CategoryScreen from '@features/catalog/screens/CategoryScreen'
import ProductListScreen from '@features/catalog/screens/ProductListScreen'
import ProductDetailScreen from '@features/product/screens/ProductDetailScreen'
import ThreeDViewerScreen from '@features/product/screens/ThreeDViewerScreen'
import ReviewsScreen from '@features/product/screens/ReviewsScreen'
import SizeGuideScreen from '@features/product/screens/SizeGuideScreen'

// Discover Stack
import SearchScreen from '@features/search/screens/SearchScreen'
import SearchResultsScreen from '@features/search/screens/SearchResultsScreen'
import VisualSearchScreen from '@features/search/screens/VisualSearchScreen'

// Live Stack
import LiveStreamListScreen from '@features/live/screens/LiveStreamListScreen'
import LiveStreamViewerScreen from '@features/live/screens/LiveStreamViewerScreen'

// Cart Stack
import CartScreen from '@features/cart/screens/CartScreen'
import CheckoutScreen from '@features/cart/screens/CheckoutScreen'
import AddressScreen from '@features/cart/screens/AddressScreen'
import PaymentScreen from '@features/cart/screens/PaymentScreen'
import OrderConfirmationScreen from '@features/cart/screens/OrderConfirmationScreen'

// Profile Stack
import ProfileScreen from '@features/profile/screens/ProfileScreen'
import EditProfileScreen from '@features/profile/screens/EditProfileScreen'
import OrdersScreen from '@features/orders/screens/OrdersScreen'
import OrderDetailScreen from '@features/orders/screens/OrderDetailScreen'
import TrackingScreen from '@features/orders/screens/TrackingScreen'
import ReturnRequestScreen from '@features/orders/screens/ReturnRequestScreen'
import WishlistScreen from '@features/wishlist/screens/WishlistScreen'
import AddressBookScreen from '@features/profile/screens/AddressBookScreen'
import PaymentMethodsScreen from '@features/profile/screens/PaymentMethodsScreen'
import SecuritySettingsScreen from '@features/profile/screens/SecuritySettingsScreen'
import NotificationsSettingsScreen from '@features/profile/screens/NotificationsSettingsScreen'
import PrivacySettingsScreen from '@features/profile/screens/PrivacySettingsScreen'
import ThemeScreen from '@features/profile/screens/ThemeScreen'
import LanguageScreen from '@features/profile/screens/LanguageScreen'
import HelpCenterScreen from '@features/profile/screens/HelpCenterScreen'
import AIAssistantScreen from '@features/ai-assistant/screens/AIAssistantScreen'
import NotificationsScreen from '@features/notifications/screens/NotificationsScreen'

const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()
const DiscoverStack = createNativeStackNavigator()
const LiveStack = createNativeStackNavigator()
const CartStack = createNativeStackNavigator()
const ProfileStack = createNativeStackNavigator()

const HomeStackNav = memo(() => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name={ROUTES.HOME} component={HomeScreen} />
    <HomeStack.Screen name={ROUTES.CATEGORY} component={CategoryScreen} />
    <HomeStack.Screen name={ROUTES.PRODUCT_LIST} component={ProductListScreen} />
    <HomeStack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    <HomeStack.Screen name={ROUTES.THREE_D_VIEWER} component={ThreeDViewerScreen} />
    <HomeStack.Screen name={ROUTES.REVIEWS} component={ReviewsScreen} />
    <HomeStack.Screen name={ROUTES.SIZE_GUIDE} component={SizeGuideScreen} />
  </HomeStack.Navigator>
))

const DiscoverStackNav = memo(() => (
  <DiscoverStack.Navigator screenOptions={{ headerShown: false }}>
    <DiscoverStack.Screen name={ROUTES.SEARCH} component={SearchScreen} />
    <DiscoverStack.Screen name={ROUTES.SEARCH_RESULTS} component={SearchResultsScreen} />
    <DiscoverStack.Screen name={ROUTES.VISUAL_SEARCH} component={VisualSearchScreen} />
  </DiscoverStack.Navigator>
))

const LiveStackNav = memo(() => (
  <LiveStack.Navigator screenOptions={{ headerShown: false }}>
    <LiveStack.Screen name={ROUTES.LIVE_LIST} component={LiveStreamListScreen} />
    <LiveStack.Screen name={ROUTES.LIVE_VIEWER} component={LiveStreamViewerScreen} />
  </LiveStack.Navigator>
))

const CartStackNav = memo(() => (
  <CartStack.Navigator screenOptions={{ headerShown: false }}>
    <CartStack.Screen name={ROUTES.CART} component={CartScreen} />
    <CartStack.Screen name={ROUTES.CHECKOUT} component={CheckoutScreen} />
    <CartStack.Screen name={ROUTES.ADDRESS} component={AddressScreen} />
    <CartStack.Screen name={ROUTES.PAYMENT} component={PaymentScreen} />
    <CartStack.Screen name={ROUTES.ORDER_CONFIRMATION} component={OrderConfirmationScreen} />
  </CartStack.Navigator>
))

const ProfileStackNav = memo(() => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    <ProfileStack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
    <ProfileStack.Screen name={ROUTES.ORDERS} component={OrdersScreen} />
    <ProfileStack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
    <ProfileStack.Screen name={ROUTES.TRACKING} component={TrackingScreen} />
    <ProfileStack.Screen name={ROUTES.RETURN_REQUEST} component={ReturnRequestScreen} />
    <ProfileStack.Screen name={ROUTES.WISHLIST} component={WishlistScreen} />
    <ProfileStack.Screen name={ROUTES.ADDRESS_BOOK} component={AddressBookScreen} />
    <ProfileStack.Screen name={ROUTES.PAYMENT_METHODS} component={PaymentMethodsScreen} />
    <ProfileStack.Screen name={ROUTES.SECURITY_SETTINGS} component={SecuritySettingsScreen} />
    <ProfileStack.Screen name={ROUTES.NOTIFICATIONS_SETTINGS} component={NotificationsSettingsScreen} />
    <ProfileStack.Screen name={ROUTES.PRIVACY_SETTINGS} component={PrivacySettingsScreen} />
    <ProfileStack.Screen name={ROUTES.THEME_SCREEN} component={ThemeScreen} />
    <ProfileStack.Screen name={ROUTES.LANGUAGE_SCREEN} component={LanguageScreen} />
    <ProfileStack.Screen name={ROUTES.HELP_CENTER} component={HelpCenterScreen} />
    <ProfileStack.Screen name={ROUTES.AI_ASSISTANT} component={AIAssistantScreen} />
    <ProfileStack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
  </ProfileStack.Navigator>
))

interface TabIconProps {
  focused: boolean
  icon: string
  label: string
}

const TabIcon: React.FC<TabIconProps> = memo(({ focused, icon, label }) => {
  const { colors } = useTheme()
  const scale = useSharedValue(focused ? 1.15 : 1)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  scale.value = withSpring(focused ? 1.15 : 1, { damping: 10 })

  return (
    <Animated.View style={[styles.tabIcon, animatedStyle]}>
      <Animated.Text style={[styles.tabEmoji]}>{icon}</Animated.Text>
      {focused && <View style={[styles.tabDot, { backgroundColor: colors.primary }]} />}
    </Animated.View>
  )
})

const MainTabNavigator: React.FC = memo(() => {
  const { colors } = useTheme()
  const cartCount = useAppSelector(state => (state as { cart?: { itemCount?: number } }).cart?.itemCount ?? 0)

  const renderHomeIcon = useCallback(
    ({ focused }: { focused: boolean }) => <TabIcon focused={focused} icon="🏠" label="Home" />,
    [],
  )
  const renderDiscoverIcon = useCallback(
    ({ focused }: { focused: boolean }) => <TabIcon focused={focused} icon="🔍" label="Discover" />,
    [],
  )
  const renderLiveIcon = useCallback(
    ({ focused }: { focused: boolean }) => <TabIcon focused={focused} icon="📺" label="Live" />,
    [],
  )
  const renderCartIcon = useCallback(
    ({ focused }: { focused: boolean }) => <TabIcon focused={focused} icon="🛒" label="Cart" />,
    [],
  )
  const renderProfileIcon = useCallback(
    ({ focused }: { focused: boolean }) => <TabIcon focused={focused} icon="👤" label="Profile" />,
    [],
  )

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'Poppins-Medium' },
      }}
    >
      <Tab.Screen
        name={ROUTES.TAB_HOME}
        component={HomeStackNav}
        options={{ tabBarLabel: 'Home', tabBarIcon: renderHomeIcon }}
      />
      <Tab.Screen
        name={ROUTES.TAB_DISCOVER}
        component={DiscoverStackNav}
        options={{ tabBarLabel: 'Discover', tabBarIcon: renderDiscoverIcon }}
      />
      <Tab.Screen
        name={ROUTES.TAB_LIVE}
        component={LiveStackNav}
        options={{ tabBarLabel: 'Live', tabBarIcon: renderLiveIcon }}
      />
      <Tab.Screen
        name={ROUTES.TAB_CART}
        component={CartStackNav}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: renderCartIcon,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent },
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_PROFILE}
        component={ProfileStackNav}
        options={{ tabBarLabel: 'Profile', tabBarIcon: renderProfileIcon }}
      />
    </Tab.Navigator>
  )
})

const styles = StyleSheet.create({
  tabIcon: { alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  tabEmoji: { fontSize: 22 },
  tabDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
})

export default MainTabNavigator
