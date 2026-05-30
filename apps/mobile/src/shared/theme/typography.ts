import { TextStyle } from 'react-native'

export const typography: Record<string, TextStyle> = {
  h1: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, lineHeight: 44 },
  h2: { fontFamily: 'PlayfairDisplay-SemiBold', fontSize: 28, lineHeight: 36 },
  h3: { fontFamily: 'Poppins-SemiBold', fontSize: 22, lineHeight: 30 },
  h4: { fontFamily: 'Poppins-SemiBold', fontSize: 18, lineHeight: 26 },
  body1: { fontFamily: 'Poppins-Regular', fontSize: 16, lineHeight: 24 },
  body2: { fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 22 },
  caption: { fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 18 },
  price: { fontFamily: 'Inter-Bold', fontSize: 18, lineHeight: 24 },
  label: { fontFamily: 'Poppins-Medium', fontSize: 14, lineHeight: 20 },
  button: { fontFamily: 'Poppins-SemiBold', fontSize: 16, lineHeight: 24 },
  overline: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
}

export const fontFamilies = {
  playfairBold: 'PlayfairDisplay-Bold',
  playfairSemiBold: 'PlayfairDisplay-SemiBold',
  poppinsRegular: 'Poppins-Regular',
  poppinsMedium: 'Poppins-Medium',
  poppinsSemiBold: 'Poppins-SemiBold',
  poppinsBold: 'Poppins-Bold',
  interRegular: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interBold: 'Inter-Bold',
}

export const fontSources = {
  'PlayfairDisplay-Bold': require('@assets/fonts/PlayfairDisplay-Bold.ttf'),
  'PlayfairDisplay-SemiBold': require('@assets/fonts/PlayfairDisplay-SemiBold.ttf'),
  'Poppins-Regular': require('@assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Medium': require('@assets/fonts/Poppins-Medium.ttf'),
  'Poppins-SemiBold': require('@assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold': require('@assets/fonts/Poppins-Bold.ttf'),
  'Inter-Regular': require('@assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('@assets/fonts/Inter-Medium.ttf'),
  'Inter-Bold': require('@assets/fonts/Inter-Bold.ttf'),
}
