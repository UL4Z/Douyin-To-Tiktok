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
                tiktok: {
                    cyan: '#00f2ea',
                    pink: '#ff0050',
                    dark: '#121212',
                    'dark-card': '#1f1f1f',
                },
            },
            animation: {
                'orbit-1': 'orbit1 1.5s linear infinite',
                'orbit-2': 'orbit2 1.5s linear infinite',
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
            },
        },
    },
    plugins: [],
}
