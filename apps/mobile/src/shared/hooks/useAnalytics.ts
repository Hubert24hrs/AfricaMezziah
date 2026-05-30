import { useCallback } from 'react'
import { logEvent, EVENTS } from '@services/analyticsService'

export const useAnalytics = () => {
  const track = useCallback((event: string, params?: Record<string, unknown>) => {
    logEvent(event, params)
  }, [])
  return { track, EVENTS }
}
