export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // This line is crucial for the plugin to find and process Flowbite components.
    "./node_modules/flowbite/**/*.js" 
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
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  // THE FIX: Add the Flowbite plugin back.
  plugins: [
    require('flowbite/plugin')
  ],
}
