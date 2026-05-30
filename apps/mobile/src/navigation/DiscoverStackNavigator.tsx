import React, { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTES } from '@shared/constants/routes'
import SearchScreen from '@features/search/screens/SearchScreen'
import SearchResultsScreen from '@features/search/screens/SearchResultsScreen'
import VisualSearchScreen from '@features/search/screens/VisualSearchScreen'
import ProductDetailScreen from '@features/product/screens/ProductDetailScreen'

const Stack = createNativeStackNavigator()
const DiscoverStackNavigator: React.FC = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} />
    <Stack.Screen name={ROUTES.SEARCH_RESULTS} component={SearchResultsScreen} />
    <Stack.Screen name={ROUTES.VISUAL_SEARCH} component={VisualSearchScreen} />
    <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
  </Stack.Navigator>
))
export default DiscoverStackNavigator
