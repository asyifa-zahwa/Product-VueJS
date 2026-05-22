/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#ffffff",
        "surface-container": "#eeeeee",
        "background": "#f9f9f9",
        "primary": "#004532",
        "on-surface": "#1a1c1c",
        "secondary": "#006c49",
        "surface-tint": "#1b6b51",
        "on-background": "#1a1c1c",
        "outline-variant": "#bec9c2",
        "outline": "#6f7973",
        "primary-fixed": "#a6f2d1",
        "tertiary": "#1e4334",
        "on-surface-variant": "#3f4944",
        "secondary-fixed": "#6ffbbe"
      },
      spacing: {
        "xs": "0.25rem", "sm": "0.5rem", "md": "1rem", "lg": "1.5rem", "xl": "2.5rem", "2xl": "4rem",
        "margin-mobile": "1rem", "margin-desktop": "2.5rem",
      },
      fontFamily: {
        "title-lg": ["Lexend"], "headline-lg": ["Lexend"], "body-lg": ["Lexend"], 
        "body-md": ["Lexend"], "body-sm": ["Lexend"], "label-md": ["Lexend"], "label-lg": ["Lexend"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}