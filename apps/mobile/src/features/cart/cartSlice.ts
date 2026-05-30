import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: string
  productId: string
  variantId?: string
  title: string
  price: number
  imageUrl: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  itemCount: number
  total: number
  couponCode?: string
  discount: number
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
  discount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.variantId === action.payload.variantId && i.productId === action.payload.productId)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) - state.discount
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload)
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) - state.discount
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.id === action.payload.id)
      if (item) item.quantity = action.payload.quantity
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) - state.discount
    },
    clearCart(state) {
      state.items = []
      state.itemCount = 0
      state.total = 0
      state.discount = 0
      state.couponCode = undefined
    },
    applyCoupon(state, action: PayloadAction<{ code: string; discount: number }>) {
      state.couponCode = action.payload.code
      state.discount = action.payload.discount
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0) - state.discount
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon } = cartSlice.actions
export default cartSlice.reducer
