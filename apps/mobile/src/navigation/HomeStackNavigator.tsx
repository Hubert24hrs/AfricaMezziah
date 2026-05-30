import React, { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTES } from '@shared/constants/routes'
import HomeScreen from '@features/home/screens/HomeScreen'
import CategoryScreen from '@features/catalog/screens/CategoryScreen'
import ProductListScreen from '@features/catalog/screens/ProductListScreen'
import ProductDetailScreen from '@features/product/screens/ProductDetailScreen'
import ThreeDViewerScreen from '@features/product/screens/ThreeDViewerScreen'
import ReviewsScreen from '@features/product/screens/ReviewsScreen'
import SizeGuideScreen from '@features/product/screens/SizeGuideScreen'

const Stack = createNativeStackNavigator()
const HomeStackNavigator: React.FC = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
    <Stack.Screen name={ROUTES.CATEGORY} component={CategoryScreen} />
    <Stack.Screen name={ROUTES.PRODUCT_LIST} component={ProductListScreen} />
    <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    <Stack.Screen name={ROUTES.THREE_D_VIEWER} component={ThreeDViewerScreen} options={{ animation: 'slide_from_bottom' }} />
    <Stack.Screen name={ROUTES.REVIEWS} component={ReviewsScreen} />
    <Stack.Screen name={ROUTES.SIZE_GUIDE} component={SizeGuideScreen} options={{ presentation: 'modal' }} />
  </Stack.Navigator>
))
export default HomeStackNavigator
