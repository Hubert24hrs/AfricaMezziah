import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Luxury African-inspired palette
                primary: {
                    50: '#fdf8f6',
                    100: '#f9ede8',
                    200: '#f2d6cc',
                    300: '#e8b9a6',
                    400: '#db9276',
                    500: '#c7714e', // Main brand color - warm terracotta
                    600: '#b85d3a',
                    700: '#9a4a30',
                    800: '#7f3f2c',
                    900: '#6a3728',
                    950: '#391a13',
                },
                secondary: {
                    50: '#f7f6f5',
                    100: '#edebe8',
                    200: '#d9d5ce',
                    300: '#c1baad',
                    400: '#a89a89',
                    500: '#968371', // Warm neutral
                    600: '#89756a',
                    700: '#726159',
                    800: '#5f514c',
                    900: '#4e4440',
                    950: '#292321',
                },
                accent: {
                    50: '#fff9ed',
                    100: '#fff1d4',
                    200: '#ffdfa8',
                    300: '#ffc770',
                    400: '#ffa537',
                    500: '#ff8b10', // Rich gold accent
                    600: '#f06f00',
                    700: '#c75202',
                    800: '#9e410b',
                    900: '#7f370c',
                    950: '#451a04',
                },
                dark: {
                    50: '#f6f5f5',
                    100: '#e7e6e5',
                    200: '#d2cfce',
                    300: '#b2adab',
                    400: '#8a8481',
                    500: '#6f6966',
                    600: '#5e5957',
                    700: '#504c4a',
                    800: '#454241',
                    900: '#3c3938',
                    950: '#1a1918', // Deep charcoal
                },
                cream: '#FAF8F5',
                ivory: '#F5F1EB',
            },
            fontFamily: {
                sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-luxury': 'linear-gradient(135deg, #1a1918 0%, #3c3938 50%, #1a1918 100%)',
                'gradient-gold': 'linear-gradient(135deg, #ffc770 0%, #ff8b10 50%, #f06f00 100%)',
            },
            boxShadow: {
                'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                '3d': '0 20px 60px -15px rgba(0, 0, 0, 0.4)',
                'glow': '0 0 40px -10px rgba(255, 139, 16, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
