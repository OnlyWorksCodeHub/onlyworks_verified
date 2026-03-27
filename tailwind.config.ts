import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		screens: {
  			xs: '475px',
  			md: '800px'
  		},
  		fontFamily: {
  			display: [
  				'Instrument Serif',
  				'Georgia',
  				'serif'
  			],
  			sans: [
  				'Instrument Sans',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'ui-monospace',
  				'SFMono-Regular',
  				'monospace'
  			]
  		},
  		colors: {
  			stone: {
  				50: '#fafaf9',
  				100: '#f5f5f4',
  				200: '#e7e4dd',
  				300: '#dad7d0',
  				400: '#a3a19b',
  				500: '#78766f',
  				600: '#57554f',
  				700: '#44423d',
  				800: '#292825',
  				900: '#1c1b18',
  				950: '#080503',
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			}
  		},
  		borderRadius: {
  			sm: '0.125rem'
  		},
  		letterSpacing: {
  			tight: '-0.025em'
  		},
  		animation: {
  			'fade-in': 'fade-in 0.6s ease-out forwards',
  			'slide-up': 'slide-up 0.6s ease-out forwards',
  			'scroll': 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
  			'marquee': 'marquee var(--duration, 40s) linear infinite',
  			'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' },
  			},
  			'slide-up': {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			'scroll': {
  				to: { transform: 'translate(calc(-50% - 0.5rem))' },
  			},
  			'marquee': {
  				from: { transform: 'translateX(0)' },
  				to: { transform: 'translateX(calc(-100% - var(--gap)))' },
  			},
  			'marquee-vertical': {
  				from: { transform: 'translateY(0)' },
  				to: { transform: 'translateY(calc(-100% - var(--gap)))' },
  			},
  		},
  		backgroundImage: {}
  	}
  },
  plugins: [],
}
export default config
