/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBg: '#F7F8E8',
        themeDark: '#174D3A',
        themeSecondary: '#2F7659',
        themeSage: '#DCEBDD',
        themeCard: '#FFFFFF',
        themeText: '#294238',
        themeMuted: '#718078',
        themeSuccess: '#2E8B57',
        themeBorder: '#DDE4D8',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(23, 77, 58, 0.08)',
        'soft-lg': '0 20px 40px -15px rgba(23, 77, 58, 0.12)',
        'card-hover': '0 14px 35px -5px rgba(23, 77, 58, 0.15)',
      }
    },
  },
  plugins: [],
}
