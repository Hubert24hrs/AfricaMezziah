import { useCallback } from 'react'
import * as Haptics from 'expo-haptics'

export const useHaptics = () => {
  const light = useCallback(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), [])
  const medium = useCallback(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), [])
  const heavy = useCallback(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), [])
  const success = useCallback(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), [])
  const error = useCallback(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), [])
  return { light, medium, heavy, success, error }
}
