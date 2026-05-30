import React, { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTES } from '@shared/constants/routes'
import CartScreen from '@features/cart/screens/CartScreen'
import CheckoutScreen from '@features/cart/screens/CheckoutScreen'
import AddressScreen from '@features/cart/screens/AddressScreen'
import PaymentScreen from '@features/cart/screens/PaymentScreen'
import OrderConfirmationScreen from '@features/cart/screens/OrderConfirmationScreen'

const Stack = createNativeStackNavigator()
const CartStackNavigator: React.FC = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.CART} component={CartScreen} />
    <Stack.Screen name={ROUTES.CHECKOUT} component={CheckoutScreen} />
    <Stack.Screen name={ROUTES.ADDRESS} component={AddressScreen} />
    <Stack.Screen name={ROUTES.PAYMENT} component={PaymentScreen} />
    <Stack.Screen name={ROUTES.ORDER_CONFIRMATION} component={OrderConfirmationScreen} />
  </Stack.Navigator>
))
export default CartStackNavigator
