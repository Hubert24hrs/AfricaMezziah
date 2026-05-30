import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

export const formatDate = (dateStr: string, pattern = 'MMM d, yyyy'): string => {
  const date = parseISO(dateStr)
  if (!isValid(date)) return dateStr
  return format(date, pattern)
}

export const formatRelativeDate = (dateStr: string): string => {
  const date = parseISO(dateStr)
  if (!isValid(date)) return dateStr
  return formatDistanceToNow(date, { addSuffix: true })
}

export const formatDeliveryDate = (dateStr: string): string => {
  const date = parseISO(dateStr)
  if (!isValid(date)) return dateStr
  return format(date, 'EEEE, MMMM d')
}

export const formatCountdown = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
