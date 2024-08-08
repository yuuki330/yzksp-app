module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#4da6ff',
                    DEFAULT: '#0066cc',
                    dark: '#004c99',
                },
                secondary: {
                    light: '#ff6b6b',
                    DEFAULT: '#ee5253',
                    dark: '#c23e3f',
                },
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}