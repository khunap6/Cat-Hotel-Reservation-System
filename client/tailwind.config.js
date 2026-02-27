/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4c7fe6",
        secondary: "#f8bbd0",
        "powder-blue": "#E3F2FD",
        "blush-pink": "#FCE4EC",
        "background-light": "#f6f9ff",
        "background-dark": "#111621",
        "neutral-soft": "#eef2f8",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      },
      container: {
        center: true,
        padding: "1rem",
      }
    },
  },
  plugins: [],
}