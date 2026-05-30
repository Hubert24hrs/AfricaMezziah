import React, { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTES } from '@shared/constants/routes'
import ProfileScreen from '@features/profile/screens/ProfileScreen'
import EditProfileScreen from '@features/profile/screens/EditProfileScreen'
import OrdersScreen from '@features/orders/screens/OrdersScreen'
import OrderDetailScreen from '@features/orders/screens/OrderDetailScreen'
import TrackingScreen from '@features/orders/screens/TrackingScreen'
import ReturnRequestScreen from '@features/orders/screens/ReturnRequestScreen'
import WishlistScreen from '@features/wishlist/screens/WishlistScreen'
import AIAssistantScreen from '@features/ai-assistant/screens/AIAssistantScreen'
import NotificationsScreen from '@features/notifications/screens/NotificationsScreen'
import AddressBookScreen from '@features/profile/screens/AddressBookScreen'
import PaymentMethodsScreen from '@features/profile/screens/PaymentMethodsScreen'
import SecuritySettingsScreen from '@features/profile/screens/SecuritySettingsScreen'
import NotificationsSettingsScreen from '@features/profile/screens/NotificationsSettingsScreen'
import PrivacySettingsScreen from '@features/profile/screens/PrivacySettingsScreen'
import ThemeScreen from '@features/profile/screens/ThemeScreen'
import LanguageScreen from '@features/profile/screens/LanguageScreen'
import HelpCenterScreen from '@features/profile/screens/HelpCenterScreen'
import AboutScreen from '@features/profile/screens/AboutScreen'

const Stack = createNativeStackNavigator()
const ProfileStackNavigator: React.FC = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
    <Stack.Screen name={ROUTES.ORDERS} component={OrdersScreen} />
    <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
    <Stack.Screen name={ROUTES.TRACKING} component={TrackingScreen} />
    <Stack.Screen name={ROUTES.RETURN_REQUEST} component={ReturnRequestScreen} />
    <Stack.Screen name={ROUTES.WISHLIST} component={WishlistScreen} />
    <Stack.Screen name={ROUTES.AI_ASSISTANT} component={AIAssistantScreen} />
    <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
    <Stack.Screen name={ROUTES.ADDRESS_BOOK} component={AddressBookScreen} />
    <Stack.Screen name={ROUTES.PAYMENT_METHODS} component={PaymentMethodsScreen} />
    <Stack.Screen name={ROUTES.SECURITY_SETTINGS} component={SecuritySettingsScreen} />
    <Stack.Screen name={ROUTES.NOTIFICATIONS_SETTINGS} component={NotificationsSettingsScreen} />
    <Stack.Screen name={ROUTES.PRIVACY_SETTINGS} component={PrivacySettingsScreen} />
    <Stack.Screen name={ROUTES.THEME_SETTINGS} component={ThemeScreen} />
    <Stack.Screen name={ROUTES.LANGUAGE_SETTINGS} component={LanguageScreen} />
    <Stack.Screen name={ROUTES.HELP_CENTER} component={HelpCenterScreen} />
    <Stack.Screen name={ROUTES.ABOUT} component={AboutScreen} />
  </Stack.Navigator>
))
export default ProfileStackNavigator
