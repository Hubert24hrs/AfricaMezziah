import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState, AppDispatch } from '@store/store'
import { logout } from '@features/auth/authSlice'
import { clearTokens } from '@services/keychainService'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'auth-storage' })

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)

  const signOut = useCallback(async () => {
    await clearTokens()
    storage.clearAll()
    dispatch(logout())
  }, [dispatch])

  return { ...auth, signOut }
}
