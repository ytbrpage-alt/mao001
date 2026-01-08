import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Enterprise-grade color system
            // Inspired by Linear, Notion, Slack dark modes
            colors: {
                // Brand colors - teal/cyan palette
                brand: {
                    50: '#E8F7FA',
                    100: '#D1EFF5',
                    200: '#A3DFEB',
                    300: '#75CFE1',
                    400: '#47BFD7',
                    500: '#1E8AAD', // Primary
                    600: '#186E8A',
                    700: '#125268',
                    800: '#0C3745',
                    900: '#061B23',
                    950: '#030E12',
                },

                // Success - Emerald tones
                success: {
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    400: '#34D399',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                },

                // Warning - Amber tones
                warning: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                    800: '#92400E',
                    900: '#78350F',
                },

                // Danger - Red tones
                danger: {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    200: '#FECACA',
                    300: '#FCA5A5',
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                    800: '#991B1B',
                    900: '#7F1D1D',
                },

                // Error alias
                error: {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    200: '#FECACA',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                },

                // Enterprise Dark Mode Neutrals
                // Based on modern SaaS platforms (Linear, Notion, Vercel)
                neutral: {
                    // Light mode grays
                    50: '#FAFAFA',
                    100: '#F4F4F5',
                    200: '#E4E4E7',
                    300: '#D4D4D8',
                    400: '#A1A1AA',
                    500: '#71717A',
                    600: '#52525B',
                    700: '#3F3F46',
                    800: '#27272A',
                    900: '#18181B',
                    950: '#09090B',
                },

                // Dark mode specific background colors
                // Enterprise-grade dark palette
                dark: {
                    // Background layers (from deepest to surface)
                    bg: '#0F0F12',           // App background
                    'bg-elevated': '#16161A', // Cards, modals
                    'bg-surface': '#1C1C21',  // Hover states
                    'bg-muted': '#24242B',    // Inputs, wells

                    // Border colors
                    border: '#2E2E36',
                    'border-subtle': '#232329',
                    'border-strong': '#3D3D47',

                    // Text colors
                    text: '#ECECEF',         // Primary text
                    'text-secondary': '#A1A1AA', // Secondary/muted
                    'text-tertiary': '#71717A',  // Disabled/placeholder
                    'text-inverted': '#0F0F12',  // On colored backgrounds

                    // Interactive states
                    hover: 'rgba(255, 255, 255, 0.05)',
                    'hover-strong': 'rgba(255, 255, 255, 0.08)',
                    pressed: 'rgba(255, 255, 255, 0.12)',

                    // Overlays
                    overlay: 'rgba(0, 0, 0, 0.7)',
                    'overlay-strong': 'rgba(0, 0, 0, 0.85)',
                },

                // Light mode specific
                light: {
                    bg: '#FFFFFF',
                    'bg-elevated': '#FFFFFF',
                    'bg-surface': '#FAFAFA',
                    'bg-muted': '#F4F4F5',
                    border: '#E4E4E7',
                    'border-subtle': '#F4F4F5',
                    'border-strong': '#D4D4D8',
                    text: '#18181B',
                    'text-secondary': '#52525B',
                    'text-tertiary': '#A1A1AA',
                },
            },

            // Typography
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
            },

            // Touch target spacing
            spacing: {
                'touch': '44px',
                'touch-lg': '48px',
                'touch-xl': '56px',
                '18': '4.5rem',
                '22': '5.5rem',
            },

            // Rounded corners
            borderRadius: {
                'sm': '6px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '20px',
                '3xl': '24px',
                'full': '9999px',
            },

            // Shadows - light and dark optimized
            boxShadow: {
                // Light mode shadows
                'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                'strong': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

                // Dark mode shadows (subtle glow effect)
                'dark-soft': '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
                'dark-medium': '0 4px 6px -1px rgba(0, 0, 0, 0.6)',
                'dark-strong': '0 10px 15px -3px rgba(0, 0, 0, 0.7)',
                'dark-glow': '0 0 0 1px rgba(255, 255, 255, 0.05)',

                // Colored glows
                'glow-brand': '0 0 20px -5px rgba(30, 138, 173, 0.4)',
                'glow-success': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
                'glow-warning': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
                'glow-danger': '0 0 20px -5px rgba(239, 68, 68, 0.4)',

                'inner-soft': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            },

            // Animations
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'fade-out': 'fadeOut 0.2s ease-in',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-left': 'slideLeft 0.3s ease-out',
                'slide-right': 'slideRight 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'bounce-soft': 'bounceSoft 0.5s ease-out',
                'spin-slow': 'spin 3s linear infinite',
                'float': 'float 3s ease-in-out infinite',
                'pulse-ring': 'pulseRing 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'shake': 'shake 0.5s ease-in-out',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                pulseRing: {
                    '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(30, 138, 173, 0.6)' },
                    '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(30, 138, 173, 0)' },
                    '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(30, 138, 173, 0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-3px)' },
                    '75%': { transform: 'translateX(3px)' },
                },
            },

            // Safe areas
            padding: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
            },

            // Backdrop blur
            backdropBlur: {
                xs: '2px',
            },

            // Transition
            transitionDuration: {
                '400': '400ms',
            },

            // Z-index
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },

            // Responsive breakpoints
            screens: {
                'xs': '375px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                'mobile': { 'max': '639px' },
                'tablet': { 'min': '640px', 'max': '1023px' },
                'desktop': { 'min': '1024px' },
            },
        },
    },
    plugins: [],
};

export default config;
