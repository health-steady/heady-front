/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GmarketSansMedium", "sans-serif"],
        gmarket: ["GmarketSansMedium", "sans-serif"],
      },
      colors: {
        primary: "#4CAF50",
        secondary: "#FFC107",
        tertiary: "#5B8DEF",
        background: "#FFFFFF",
        card: "#F5F5F5",
        text: "#333333",
      },
    },
  },
  plugins: [],
};
