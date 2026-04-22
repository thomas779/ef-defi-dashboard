/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        void:   '#060609',
        ink:    '#0C0C14',
        panel:  '#101018',
        edge:   '#18182A',
        rim:    '#24243C',
        dim:    '#44445E',
        muted:  '#68688A',
        soft:   '#9898BC',
        pale:   '#C4C4DC',
        bright: '#E8E8F8',
        gold:  { DEFAULT: '#C8942A', dim: '#7A5A18', bright: '#E8B040' },
        jade:  { DEFAULT: '#0DD88A', dim: '#065C3A' },
        crim:  { DEFAULT: '#E03030', dim: '#4A0E0E', bright: '#F04848' },
        amber: { DEFAULT: '#D4850A', dim: '#3A2200' },
        steel: { DEFAULT: '#4A8EC4', dim: '#1A3550' },
      },
    },
  },
  plugins: [],
}
