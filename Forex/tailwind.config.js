/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          400: '#3b82f6',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        accent: {
          400: '#a21caf',
        },
        neon: {
          400: '#22d3ee',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        pink: {
          500: '#ec4899',
          600: '#db2777',
        },
        yellow: {
          300: '#fde68a',
          400: '#facc15',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          400: '#9ca3af',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
