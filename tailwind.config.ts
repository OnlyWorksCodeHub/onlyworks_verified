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
          DEFAULT: '#6b46c1',
          light: '#8b5cf6',
          dark: '#553c9a',
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
