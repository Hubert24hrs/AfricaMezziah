import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const emailSchema = z.string().email('Invalid email address').toLowerCase().trim()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')

export const phoneSchema = z
  .string()
  .refine(val => {
    const phone = parsePhoneNumberFromString(val, 'NG')
    return phone?.isValid() ?? false
  }, 'Invalid phone number')

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d+$/, 'OTP must contain only digits')

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').trim(),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').trim(),
  line1: z.string().min(5, 'Address is too short').trim(),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required').trim(),
  state: z.string().min(2, 'State is required').trim(),
  country: z.string().min(2, 'Country is required').trim(),
  postalCode: z.string().min(3, 'Postal code is required').trim(),
  isDefault: z.boolean().default(false),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title is too short').trim(),
  body: z.string().min(10, 'Review is too short').trim(),
})

export const sanitizeText = (input: string): string =>
  input.replace(/<[^>]*>/g, '').trim()
