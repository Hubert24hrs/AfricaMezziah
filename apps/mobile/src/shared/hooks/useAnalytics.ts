import { useCallback } from 'react'
import { logEvent, logScreenView, EVENTS } from '@services/analyticsService'

export const useAnalytics = () => {
  const trackEvent = useCallback(
    async (event: string, params?: Record<string, string | number | boolean>) => {
      await logEvent(event, params)
    },
    [],
  )

  const trackScreen = useCallback(async (screenName: string) => {
    await logScreenView(screenName)
  }, [])

  return { trackEvent, trackScreen, EVENTS }
}
