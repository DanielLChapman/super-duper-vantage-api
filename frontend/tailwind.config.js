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
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lavenderWebBlueish: 'rgb(231,230,247)',
        delftBlue: 'rgb(49, 59, 114)',
        palePurple: 'rgb(227, 208, 216)',
        roseQuartz: 'rgb(174, 163, 176)',
        lavenderWeb: 'rgb(198, 210, 237)',
        olive: '#A5B0A3',
        jet: '#484349',
        snow: '#F7F0F0',
        electricBlue: '#8AF3FF',
        persianRed: '#CC2936',
        persianGreen: '#18A999',
        darkOrange: '#F58F29'
      },
      fontFamily: {
        open: ['Open Sans', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
      }
    },
  },
  variants: {
    opacity: ({ after }) => after(['disabled'])
  },
  plugins: [],
}
