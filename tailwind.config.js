export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': { 'light': '#a7f3d0', 'DEFAULT': '#34d399', 'dark': '#059669' },
        'secondary': { 'light': '#93c5fd', 'DEFAULT': '#3b82f6', 'dark': '#1d4ed8' },
        'dark-bg': '#111827',
        'dark-card': '#1f2937',
        'dark-text': '#d1d5db',
        'dark-heading': '#f9fafb',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
