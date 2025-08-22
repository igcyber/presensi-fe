/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Portal colors based on CSS variables
        "portal-green": "#00a85f",
        "portal-green-dark": "#00884d",
        "portal-blue": "#0d3455",
        "portal-blue-dark": "#062035",
        "portal-blue-light": "#4475a1",
        "portal-grey": "#606060",
        "portal-gold": "#c1a683",
        "portal-gold-dark": "#9c794b",

        // Existing colors from variables
        primary: "var(--color-primary, #00a85f)",
        "primary-dark": "var(--color-primary-dark, #00884d)",
        secondary: "var(--color-secondary, #0d3455)",
      },
      screens: {
        tablet: { max: "1000px" },
        mobile: { max: "700px" },
        "sm-mobile": { max: "450px" },
        xs: { max: "340px" },
      },
      spacing: {
        1.75: "0.4375rem", // 7px
        7.5: "1.875rem", // 30px
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
      },
      animation: {
        "up-down": "up-down 0.5s infinite alternate",
        "slide-up": "slide-up 0.5s ease-in-out",
      },
      keyframes: {
        "up-down": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      flexBasis: {
        "22%": "22%",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
};
