import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5553fa',
          light: '#7572ff',
          dark: '#3936d7',
        },
        secondary: {
          DEFAULT: '#0066cc',
          dark: '#0052a3',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e1e1e1',
          300: '#d0d0d0',
          600: '#666666',
          800: '#2a2a2a',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#141414',
          border: '#2a2a2a',
        },
      },
      fontFamily: {
        'grotesk': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
