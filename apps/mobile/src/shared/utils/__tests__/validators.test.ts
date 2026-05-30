import {
  emailSchema,
  passwordSchema,
  otpSchema,
  loginSchema,
  sanitizeText,
} from '../validators'

describe('emailSchema', () => {
  it('accepts a valid email and lowercases it', () => {
    expect(emailSchema.parse('User@Example.COM')).toBe('user@example.com')
  })

  it('rejects an invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false)
  })
})

describe('passwordSchema', () => {
  it('accepts a strong password', () => {
    expect(passwordSchema.safeParse('Str0ng!Pass').success).toBe(true)
  })

  it.each([
    ['short', 'Aa1!'],
    ['no uppercase', 'weak1!pass'],
    ['no number', 'WeakPass!'],
    ['no special char', 'WeakPass1'],
  ])('rejects a password with %s', (_label, value) => {
    expect(passwordSchema.safeParse(value).success).toBe(false)
  })
})

describe('otpSchema', () => {
  it('accepts a 6-digit code', () => {
    expect(otpSchema.safeParse('123456').success).toBe(true)
  })

  it('rejects non-numeric or wrong-length codes', () => {
    expect(otpSchema.safeParse('12345').success).toBe(false)
    expect(otpSchema.safeParse('12a456').success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('requires both email and password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true)
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false)
  })
})

describe('sanitizeText', () => {
  it('strips HTML tags and trims', () => {
    expect(sanitizeText('  <script>alert(1)</script>hello  ')).toBe('alert(1)hello')
    expect(sanitizeText('<b>bold</b>')).toBe('bold')
  })
})
