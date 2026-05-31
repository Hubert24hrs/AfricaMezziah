import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { MMKV } from 'react-native-mmkv'
import { authApi } from './api/authApi'
import { productsApi } from './api/productsApi'
import { cartApi } from './api/cartApi'
import { ordersApi } from './api/ordersApi'
import { userApi } from './api/userApi'
import { paymentsApi } from './api/paymentsApi'
import { aiApi } from './api/aiApi'
import { liveApi } from './api/liveApi'
import { homeApi } from './api/homeApi'
import { notificationsApi } from './api/notificationsApi'
import { rootReducer, RootState } from './rootReducer'

const mmkv = new MMKV({ id: 'redux-persist' })

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
      notificationsApi.middleware,
    ),
  devTools: __DEV__,
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export { mmkv }
