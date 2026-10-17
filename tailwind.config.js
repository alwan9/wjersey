/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0C',
          dark: '#111827',
          charcoal: '#1F2937',
          gray: '#64748B',
          'light-gray': '#F1F5F9',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          'border-light': '#F1F5F9',
          // Biru Muda Banget (Soft Baby Blue / Ice Blue Accents)
          'sky-50': '#F0F9FF',
          'sky-100': '#E0F2FE',
          'sky-200': '#BAE6FD',
          'sky-300': '#7DD3FC',
          'sky-400': '#38BDF8',
          'sky-500': '#0EA5E9',
          'sky-600': '#0284C7',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'clean-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)',
        'clean-md': '0 12px 24px -6px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.03)',
        'clean-lg': '0 20px 35px -10px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.03)',
        'sky-glow': '0 0 25px -4px rgba(56, 189, 248, 0.25)',
      }
    },
  },
  plugins: [],
}
