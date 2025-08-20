/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        secondary: "var(--color-secondary)",
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
    },
  },
  plugins: [],
};
