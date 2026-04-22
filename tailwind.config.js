/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        parchment: '#f5f4ed',
        ivory:     '#faf9f5',
        sand:      '#e8e6dc',
        cream:     '#e8e5da',
        'warm-border': '#e0ddd2',
        brand: { DEFAULT: '#1B365D', light: '#2D5A8A', faint: '#EEF2F7', tint: '#E4ECF5' },
        'near-black': '#141413',
        'dark-warm':  '#3d3d3a',
        charcoal:  '#4d4c48',
        olive:     '#5e5d59',
        stone:     '#87867f',
        silver:    '#b0aea5',
        error:     { DEFAULT: '#b53333', faint: '#F5EBEB', tint: '#EDD5D5' },
        success:   { DEFAULT: '#2A6B4A', faint: '#EAF3EE', tint: '#D2E8DC' },
        warn:      { DEFAULT: '#8B5E2A', faint: '#F5EEE5', tint: '#E8DACC' },
      },
    },
  },
  plugins: [],
}
