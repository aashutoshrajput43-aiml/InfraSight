/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f172a',
          1: '#112a48',
          2: '#1e293b',
          3: '#334155',
        },
        teal: {
          DEFAULT: '#0891b2',
          dark: '#0e7490',
          light: '#e0f2fe',
          vibrant: '#17a6bd',
        },
        brand: {
          blue: '#247bb5',
          canvas: '#f1f5f9',
          surface: '#ffffff',
          ink: '#0f172a',
          muted: '#475569',
          line: '#e2e8f0',
        },
        critical: {
          DEFAULT: '#ef4444',
          bg: '#fef2f2',
          border: '#fca5a5',
        },
        high: {
          DEFAULT: '#f97316',
          bg: '#fff7ed',
          border: '#fed7aa',
        },
        medium: {
          DEFAULT: '#eab308',
          bg: '#fefce8',
          border: '#fde68a',
        },
        low: {
          DEFAULT: '#22c55e',
          bg: '#f0fdf4',
          border: '#86efac',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Inter', 'sans-serif'],
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.06)',
        flyout: '0 4px 6px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.1)',
        phone: '0 30px 80px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        phone: '40px',
        card: '14px',
      }
    },
  },
  plugins: [],
}
