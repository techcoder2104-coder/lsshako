/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',      // Sky Blue
        secondary: '#22C55E',    // Grass Green
        accent: '#22C55E',       // Grass Green (accent)
      },
      fontFamily: {
        fantasy: ['Segoe Print', 'Comic Sans MS', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
