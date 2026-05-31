# API Contracts

Base URL: `REACT_NATIVE_API_BASE_URL` (from env)
All requests: `Authorization: Bearer <access_token>` except public endpoints.
All responses follow: `{ data, meta?, error? }`

## Auth
```
POST   /auth/register          { name, email, phone, password }
POST   /auth/login             { email, password } | { phone, otp }
POST   /auth/refresh-token     { refreshToken }
POST   /auth/logout            { refreshToken }
POST   /auth/forgot-password   { email }
POST   /auth/verify-otp        { phone|email, otp, purpose }
POST   /auth/google            { idToken }
POST   /auth/apple             { identityToken, authorizationCode }
POST   /auth/enable-mfa        → { qrCodeUrl, secret, backupCodes }
POST   /auth/verify-mfa        { totpCode }
GET    /auth/sessions          → [{ id, device, location, lastSeen }]
DELETE /auth/sessions/:id
```

## Products
```
GET    /products               ?page&limit&category&subcategory&minPrice&maxPrice&sizes&colors&brands&rating&sort&q
GET    /products/:id           → full product with variants, images, seller
GET    /products/:id/reviews   ?page&limit&rating&withPhotos
POST   /products/:id/reviews   { rating, title, body, photos[] }
GET    /categories             → tree structure
GET    /categories/:id/products  same params as /products
POST   /search/visual          { imageBase64 } → similar products
```

## Cart
```
GET    /cart
POST   /cart/items             { productId, variantId, quantity }
PUT    /cart/items/:id         { quantity }
DELETE /cart/items/:id
POST   /cart/apply-coupon      { code }
DELETE /cart/remove-coupon
GET    /cart/shipping-estimate { addressId }
```

## Orders
```
POST   /orders                 { addressId, paymentMethodId, couponCode }
GET    /orders                 ?page&limit&status
GET    /orders/:id
GET    /orders/:id/tracking    → { steps[], currentLocation, estimatedDelivery }
POST   /orders/:id/return      { items[], reason, description, photos[] }
GET    /orders/:id/invoice     → PDF stream
```

## User
```
GET    /users/me
PUT    /users/me               { name, email, phone, birthday }
POST   /users/me/avatar        multipart/form-data { file }
DELETE /users/me               (account deletion request)

GET    /users/me/addresses
POST   /users/me/addresses     { label, line1, line2, city, state, country, postalCode, isDefault }
PUT    /users/me/addresses/:id
DELETE /users/me/addresses/:id

GET    /users/me/wishlist       ?page&limit
POST   /users/me/wishlist       { productId }
DELETE /users/me/wishlist/:productId

GET    /users/me/loyalty        → { points, tier, history[] }
GET    /users/me/referral       → { code, totalReferrals, earnings }
```

## Payments
```
POST   /payments/initiate      { orderId, method, currency }  → { authUrl?, reference }
POST   /payments/verify        { reference }                  → { status, orderId }
GET    /payments/methods        → [{ id, type, last4, expiry, isDefault }]
POST   /payments/methods        { token, type }  (Paystack/Stripe token)
DELETE /payments/methods/:id
GET    /payments/wallet         → { balance, currency, transactions[] }
```

## AI
```
POST   /ai/chat                { messages: [{role, content}], sessionId? }  → { reply, products[]? }
GET    /ai/recommendations     ?userId&limit&context  → { products[] }
POST   /ai/outfit-suggestions  { productId }          → { outfits[] }
```

## Live Shopping
```
GET    /live/streams           ?status=live|upcoming&category
GET    /live/streams/:id       → { streamUrl, host, products[], viewerCount }
POST   /live/streams/:id/chat  { message }
```

## Notifications
```
GET    /notifications          ?page&limit&read
PUT    /notifications/read-all
DELETE /notifications/:id
POST   /notifications/device-token  { token, platform }
```

## Response Format
```ts
interface ApiResponse<T> {
  data: T
  meta?: { page: number; limit: number; total: number; totalPages: number }
  error?: { code: string; message: string; details?: Record<string, string[]> }
}
```

## Error Codes
```
AUTH_001  Invalid credentials
AUTH_002  Token expired
AUTH_003  MFA required
AUTH_004  Account locked
CART_001  Product out of stock
CART_002  Insufficient quantity
PAY_001   Payment failed
PAY_002   Card declined
ORDER_001 Order not found
RATE_001  Too many requests
```
