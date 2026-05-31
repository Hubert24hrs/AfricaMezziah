export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  loyaltyPoints: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  isMFAEnabled: boolean
  createdAt: string
}

export interface LoginRequest {
  email?: string
  password?: string
  phone?: string
  otp?: string
}

export interface LoginResponse {
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
}

export interface RegisterResponse {
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}

export interface RefreshTokenResponse {
  data: {
    accessToken: string
    refreshToken: string
  }
}

export interface OTPVerifyRequest {
  destination: string
  otp: string
  purpose: 'register' | 'login' | 'reset'
}

export interface ForgotPasswordRequest {
  email: string
}

export interface SocialAuthRequest {
  idToken: string
}

export interface MFASetupResponse {
  data: {
    qrCodeUrl: string
    secret: string
    backupCodes: string[]
  }
}

export interface MFAVerifyRequest {
  totpCode: string
}

export interface ActiveSession {
  id: string
  device: string
  location: string
  lastSeen: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  biometricEnabled: boolean
}
