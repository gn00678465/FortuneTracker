module.exports = {
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  darkMode: false, // or 'media' or 'class',
  important: true,
  theme: {
    extend: {
      colors: {
        primary: '#ffdf5e',
        secondary: '#2d3748',
        success: '#198754',
        danger: '#dc3545',
        info: '#0dcaf0',
        light: '#f8f9fa',
        dark: '#212529',
        expense: 'rgb(247, 108, 131)',
        income: 'rgb(148, 201, 98)'
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      borderColor: ['disabled'],
      textColor: ['disabled'],
      backgroundColor: ['disabled'],
      cursor: ['disabled']
    }
  },
  plugins: []
}
