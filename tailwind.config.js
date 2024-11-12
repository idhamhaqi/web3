/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ejs}",
    "./public/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        'ton-blue': '#29A5F8',
        'ton-cyan': '#29CCF8',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
