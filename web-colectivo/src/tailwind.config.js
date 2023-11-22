/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*/.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'verde': {
        oscuro: '#022c22',
        normal: '#5c8001',
        claro:'#7cb518',
      },
      'amarillo' : '#f3de2c',
      'naranja': {
        normal: '#fb6107',
        claro: '#fbb02d',
      },
      'blanco': '#f5f6f7',
    },

    fontFamily: {
      'base': ['Poppins', 'sans-serif'],
      'texts' : ['ui-sans-serif', 'system-ui'],
    }
  },

  plugins: [
    require('daisyui'), 
    require('@tailwindcss/forms'),
  ],
 
}