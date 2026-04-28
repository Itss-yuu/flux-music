/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        visualizer: 'visualizerBar 0.8s ease-in-out infinite',
        glitch: 'glitch 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
