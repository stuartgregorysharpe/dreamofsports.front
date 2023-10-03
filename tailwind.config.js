/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // add this line
    "./node_modules/flowbite/**/*.js" // add this line
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        'main': "#C10808",
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

