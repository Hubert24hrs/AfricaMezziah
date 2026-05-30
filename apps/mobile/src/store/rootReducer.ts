import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import cartReducer from '@features/cart/cartSlice'
import themeReducer from './themeSlice'
import { authApi } from './api/authApi'
import { productsApi } from './api/productsApi'
import { cartApi } from './api/cartApi'
import { ordersApi } from './api/ordersApi'
import { userApi } from './api/userApi'
import { paymentsApi } from './api/paymentsApi'
import { aiApi } from './api/aiApi'
import { liveApi } from './api/liveApi'
import { homeApi } from './api/homeApi'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  theme: themeReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
  [liveApi.reducerPath]: liveApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
