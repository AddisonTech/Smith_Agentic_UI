/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:     '#06060f',
        surface:  '#0c0c1a',
        elevated: '#111122',
        border:   '#1c1c38',
        'border-bright': '#22d3ee40',
        'text-primary':  '#f1f5f9',
        'text-muted':    '#94a3b8',
        'text-dim':      '#475569',
        accent:   '#22d3ee',
        'accent-hover': '#67e8f9',
        'accent-glow':  '#0891b2',
        violet:   '#a78bfa',
        running:  '#22d3ee',
        success:  '#4ade80',
        warning:  '#f59e0b',
        error:    '#ef4444',
        starting: '#a78bfa',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow':   'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-up':     'slideUp 0.25s ease-out',
        'blink':        'blink 1.2s step-end infinite',
        'float-slow':   'floatOrb 11s ease-in-out infinite',
        'float-slow-r': 'floatOrb 14s ease-in-out infinite reverse',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        blink:    { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        floatOrb: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%':      { transform: 'translateY(-30px) scale(1.04)' },
        },
      },
    },
  },
  plugins: [],
}
