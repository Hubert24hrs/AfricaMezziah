# Fonts

The app expects the following `.ttf` files in this directory. Download them from Google Fonts and drop them here before running a native/Expo build (they are required by `expo-font` in `App.tsx`):

- **Poppins** (https://fonts.google.com/specimen/Poppins): `Poppins-Regular.ttf`, `Poppins-Medium.ttf`, `Poppins-SemiBold.ttf`, `Poppins-Bold.ttf`
- **Playfair Display** (https://fonts.google.com/specimen/Playfair+Display): `PlayfairDisplay-SemiBold.ttf`, `PlayfairDisplay-Bold.ttf`
- **Inter** (https://fonts.google.com/specimen/Inter): `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-Bold.ttf`

Without these files, font loading at startup will fail and text will fall back to the system font.
