/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        nunito_sans: ['"Nunito Sans"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        hedvig_letters: ['"Hedvig Letters Serif"', 'serif'],
        Noto_sans: ['"Noto Sans"', 'sans-serif']
      },
      colors: {
        white_bg: "#ffffff",
        dark_bg: "#040D12"
      }
    },
  },
  plugins: [import("tailwindcss-animate")],
  darkMode: ["class"]
} 