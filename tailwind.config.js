/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { brand: '#2563EB', navy: '#0F172A' },
      fontFamily: {
        sans: ['Inter', 'Aptos', 'Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 8px 30px rgba(15,23,42,.06)' },
    },
  },
  plugins: [],
};
