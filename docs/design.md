# Design System

## Visual Language
**Afrofuturism**: African textile patterns + metallic gold + deep space dark backgrounds + glassmorphism + neon accent glows.
Reference: SHEIN for product density layout. Elevated with African cultural identity.

## Colors (src/shared/theme/colors.ts)
```ts
export const colors = {
  // Brand
  primary:        '#C9A84C',   // Gold — CTAs, highlights, selected states
  secondary:      '#1A1A2E',   // Deep navy — surfaces, cards
  accent:         '#E94560',   // Red — flash sale, sale badges, alerts
  // Backgrounds
  background:     '#0F0F1A',   // App background (dark mode)
  backgroundLight:'#FAFAFA',   // App background (light mode)
  surface:        '#16213E',   // Card, modal, bottom sheet bg
  surfaceHover:   '#1E2D50',   // Pressed/hover state
  // Text
  textPrimary:    '#FFFFFF',
  textSecondary:  '#B0B0C3',
  textMuted:      '#6B6B80',
  textInverse:    '#0F0F1A',
  // Status
  success:        '#00C896',
  warning:        '#FFB830',
  error:          '#FF4757',
  info:           '#0EA5E9',
  // Borders
  border:         'rgba(255,255,255,0.12)',
  borderStrong:   'rgba(255,255,255,0.24)',
}
```

## Typography (src/shared/theme/typography.ts)
```ts
// Fonts: Poppins (body/UI), Playfair Display (headings/brand), Inter (data/numbers)
export const typography = {
  h1:    { fontFamily: 'PlayfairDisplay-Bold',   fontSize: 36, lineHeight: 44 },
  h2:    { fontFamily: 'PlayfairDisplay-SemiBold',fontSize: 28, lineHeight: 36 },
  h3:    { fontFamily: 'Poppins-SemiBold',       fontSize: 22, lineHeight: 30 },
  h4:    { fontFamily: 'Poppins-SemiBold',       fontSize: 18, lineHeight: 26 },
  body1: { fontFamily: 'Poppins-Regular',        fontSize: 16, lineHeight: 24 },
  body2: { fontFamily: 'Poppins-Regular',        fontSize: 14, lineHeight: 22 },
  caption:{ fontFamily: 'Inter-Regular',         fontSize: 12, lineHeight: 18 },
  price: { fontFamily: 'Inter-Bold',             fontSize: 18, lineHeight: 24 },
  label: { fontFamily: 'Poppins-Medium',         fontSize: 14, lineHeight: 20 },
}
```

## Spacing (multiples of 4)
```ts
export const spacing = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 }
```

## Border Radius
```ts
export const radius = { sm:4, md:8, lg:16, xl:24, full:999 }
```

## Shadows (gold glow for primary, subtle for cards)
```ts
export const shadows = {
  card:    { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:8, elevation:8 },
  goldGlow:{ shadowColor:'#C9A84C', shadowOffset:{width:0,height:0}, shadowOpacity:0.6, shadowRadius:12, elevation:12 },
  redGlow: { shadowColor:'#E94560', shadowOffset:{width:0,height:0}, shadowOpacity:0.5, shadowRadius:8, elevation:8 },
}
```

## Glassmorphism Card Style
```ts
// Apply to modals, feature cards, overlays
glass: {
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.12)',
  borderRadius: radius.lg,
  // iOS backdrop blur via @react-native-community/blur (BlurView)
}
```

## Component Specs

### Button
- **Primary**: gold gradient (#C9A84C → #A8762F), white text, goldGlow shadow, 48h, full radius
- **Secondary**: transparent bg, gold border, gold text
- **Ghost**: transparent, white text
- **Danger**: accent (#E94560) bg, white text
- All: loading spinner replaces label, disabled at 40% opacity, haptic on press

### ProductCard (2-column grid)
- Fast image with shimmer placeholder
- Glassmorphism overlay on image for discount badge (top-left)
- Title: body2, 2 lines max, truncate
- Price: Inter-Bold primary gold; strikethrough original price in textMuted
- Rating: star row (5 stars) + count in caption
- Wishlist heart: absolute top-right, animated burst on add
- Quick-add cart button: appears on long-press

### Input Field
- Floating animated label (Reanimated 2 spring)
- Focus: gold border + label floats up
- Error: red border + error message below with shake animation
- Success: green checkmark icon appears right
- Min height: 56dp

### Badge Types
- Discount: red (#E94560), white text, rounded `–30%`
- New: green (#00C896)
- Hot: orange (#FFB830) + flame icon
- Flash Sale: red + lightning bolt + countdown
- Out of Stock: gray, semi-transparent

### Bottom Sheet
- react-native-bottom-sheet
- Handle bar centered, surface background, rounded top corners (radius.xl)
- Backdrop: black 50% opacity, tap to dismiss

## Micro-Interactions
- Wishlist add: heart scale 1→1.4→1 + color fill + particle burst (react-native-particle)
- Add to cart: cart icon bounce + badge counter increment with spring
- All TouchableOpacity: activeOpacity 0.75 + haptic impact light
- Page transition (ProductDetail): shared element transition on product image (react-native-shared-element)
- Pull-to-refresh: custom Lottie (kente pattern animation)
- Filter bottom sheet: spring open, spring close
- Tab bar icons: scale 1→1.15 on select + gold color fill

## Home Screen Sections (in order)
1. **HeroBanner** — auto-scroll carousel, 280h, full-width, parallax, gradient overlay, CTA button
2. **PromoBar** — free shipping threshold + flash sale link (2-column horizontal strip)
3. **CategoryGrid** — circular icons horizontal scroll (Women, Men, Children, Shoes, Bags, Accessories, Ankara, Formal, Sportswear, Swimwear)
4. **FlashSaleStrip** — red/gold bar, countdown timer HH:MM:SS, horizontal product scroll
5. **AIPicksStrip** — "Picked For You" personalized horizontal scroll, AI sparkle badge
6. **TrendingMasonry** — staggered 2-col grid, like count overlay
7. **BrandVideoStrip** — full-width, autoplay muted loop, tap to unmute
8. **NewArrivalsGrid** — standard 2-col, "New" badge
9. **SuperDealsStrip** — heavy discount items horizontal scroll (reference: SHEIN Super Deals)
10. **StyleBlogStrip** — content cards horizontal scroll

## Futuristic UI Elements
- Neon glow shadow on primary buttons and selected tabs
- African kente/adinkra SVG pattern texture as subtle opacity overlay on hero/banners
- Holographic shimmer effect on "Premium" product image cards (Reanimated gradient animation)
- Animated gradient border on "Flash Sale" and "Hot" featured item cards
- Glassmorphism on all modals and overlay cards
