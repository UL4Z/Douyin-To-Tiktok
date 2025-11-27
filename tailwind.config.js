/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary)',
                    dark: 'var(--primary-dark)',
                },
                secondary: 'var(--secondary)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    light: 'var(--accent-light)',
                },
                surface: 'var(--surface)',
                success: 'var(--success)',
                warning: 'var(--warning)',
                error: 'var(--error)',
                bamboo: {
                    DEFAULT: '#78C850',
                    dark: '#5da33a',
                },
                'bamboo-red': {
                    DEFAULT: '#FF5B5B',
                    dark: '#E04F4F',
                },
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            animation: {
                'orbit-1': 'orbit1 1.5s linear infinite',
                'orbit-2': 'orbit2 1.5s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                orbit1: {
                    '0%': { transform: 'rotate(0deg) translateX(24px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(24px) rotate(-360deg)' },
                },
                orbit2: {
                    '0%': { transform: 'rotate(180deg) translateX(24px) rotate(-180deg)' },
                    '100%': { transform: 'rotate(540deg) translateX(24px) rotate(-540deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        },
    },
    plugins: [],
}
