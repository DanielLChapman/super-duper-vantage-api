/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js, jsx, ts, tsx}",
    "./src/Components/**/*.{html,js, jsx, ts, tsx}",
    "./src/Components/*.{html,js, jsx, ts, tsx}",
     // using ./src/ dir
     "./src/**/*.{js,ts,jsx,tsx}",
     // using ./ dir
     "./app/**/*.{js,ts,jsx,tsx}",
     "./components/**/*.{js,ts,jsx,tsx}",
     // add more paths here
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
