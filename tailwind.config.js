/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:     '#07070F',
        surface:  '#0D0D1A',
        elevated: '#131325',
        border:   '#1C1C38',
        'border-bright': '#2A2A50',
        'text-primary':  '#E2E2F0',
        'text-muted':    '#6A6A8A',
        'text-dim':      '#3A3A5C',
        accent:   '#7C3AED',
        'accent-hover': '#8B5CF6',
        'accent-glow':  '#6D28D9',
        running:  '#06B6D4',
        success:  '#10B981',
        warning:  '#F59E0B',
        error:    '#EF4444',
        starting: '#A855F7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'blink':      'blink 1.2s step-end infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        blink:   { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
}
