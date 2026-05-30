import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import rootReducer from './rootReducer'
import { authApi } from './api/authApi'
import { productsApi } from './api/productsApi'
import { cartApi } from './api/cartApi'
import { ordersApi } from './api/ordersApi'
import { userApi } from './api/userApi'
import { paymentsApi } from './api/paymentsApi'
import { aiApi } from './api/aiApi'
import { liveApi } from './api/liveApi'
import { homeApi } from './api/homeApi'

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      productsApi.middleware,
      cartApi.middleware,
      ordersApi.middleware,
      userApi.middleware,
      paymentsApi.middleware,
      aiApi.middleware,
      liveApi.middleware,
      homeApi.middleware,
    ),
  devTools: __DEV__,
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
