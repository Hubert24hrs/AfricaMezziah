import { Platform } from 'react-native'

const isIOS = Platform.OS === 'ios'

export const shadows = {
  card: isIOS
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }
    : { elevation: 8 },

  goldGlow: isIOS
    ? {
        shadowColor: '#C9A84C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
      }
    : { elevation: 12 },

  redGlow: isIOS
    ? {
        shadowColor: '#E94560',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      }
    : { elevation: 8 },

  subtle: isIOS
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      }
    : { elevation: 3 },
} as const
