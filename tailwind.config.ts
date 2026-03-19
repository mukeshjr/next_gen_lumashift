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
      colors: {
        brand: {
          orange: '#F97316',
          'orange-light': '#FB923C',
          'orange-dark': '#EA580C',
          'orange-subtle': '#FFF7ED',
        },
        cyber: {
          midnight: '#0B1120',
          surface: '#131B2E',
          card: '#1A2340',
          border: '#243049',
          cyan: '#06B6D4',
          'cyan-light': '#22D3EE',
          'cyan-dark': '#0891B2',
          teal: '#14B8A6',
        },
        dark: {
          bg: '#0A0A0A',
          surface: '#141414',
          card: '#1E1E1E',
          border: '#2A2A2A',
          text: '#E5E5E5',
          muted: '#888888',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F8F8F8',
          card: '#FFFFFF',
          border: '#E5E5E5',
          text: '#111111',
          muted: '#666666',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
