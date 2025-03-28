/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffffff',    // Ren vit
          dark: '#f3f4f6'       // Ljusgrå för hover
        },
        accent: {
          DEFAULT: '#dc2626',    // Kraftfull röd
          light: '#ef4444',      // Ljusare röd för hover
          dark: '#b91c1c'        // Mörkare röd för active
        },
        neutral: {
          DEFAULT: '#C0C0C0',    // Silver
          light: '#D3D3D3',      // Ljusare silver
          dark: '#A9A9A9'        // Mörkare silver
        },
        dark: {
          DEFAULT: '#171717',    // Nästan svart
          light: '#262626',      // Mörkgrå
          darker: '#0a0a0a'      // Djup svart
        }
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0,0,0,0.05)',
        'medium': '0 4px 6px rgba(0,0,0,0.07)',
      }
    },
  },
  plugins: [],
} 