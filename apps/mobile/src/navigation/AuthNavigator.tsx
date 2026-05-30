import React, { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTES } from '@shared/constants/routes'
import SplashScreen from '@features/auth/screens/SplashScreen'
import OnboardingCarousel from '@features/auth/screens/OnboardingCarousel'
import LanguageSelectionScreen from '@features/auth/screens/LanguageSelectionScreen'
import ConsentScreen from '@features/auth/screens/ConsentScreen'
import LoginScreen from '@features/auth/screens/LoginScreen'
import RegisterScreen from '@features/auth/screens/RegisterScreen'
import OTPVerificationScreen from '@features/auth/screens/OTPVerificationScreen'
import ForgotPasswordScreen from '@features/auth/screens/ForgotPasswordScreen'
import BiometricSetupScreen from '@features/auth/screens/BiometricSetupScreen'
import MFASetupScreen from '@features/auth/screens/MFASetupScreen'

const Stack = createNativeStackNavigator()

const AuthNavigator: React.FC = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
    <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingCarousel} />
    <Stack.Screen name={ROUTES.LANGUAGE_SELECTION} component={LanguageSelectionScreen} />
    <Stack.Screen name={ROUTES.CONSENT} component={ConsentScreen} />
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
    <Stack.Screen name={ROUTES.OTP_VERIFICATION} component={OTPVerificationScreen} />
    <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    <Stack.Screen name={ROUTES.BIOMETRIC_SETUP} component={BiometricSetupScreen} />
    <Stack.Screen name={ROUTES.MFA_SETUP} component={MFASetupScreen} />
  </Stack.Navigator>
))

export default AuthNavigator
