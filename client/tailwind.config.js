/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#14100D",
          light: "#1F1712",
        },
        espresso: {
          DEFAULT: "#3B2A20",
          light: "#4C3628",
        },
        coffee: {
          DEFAULT: "#6F4E37",
          light: "#8A6A4E",
        },
        cream: {
          DEFAULT: "#F5EDE0",
          dark: "#EDE2CF",
        },
        beige: "#E8DCC8",
        copper: {
          DEFAULT: "#C9A15A",
          light: "#DBBC81",
          dark: "#A9813F",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      boxShadow: {
        premium: "0 20px 60px -15px rgba(20, 16, 13, 0.35)",
        card: "0 8px 30px -8px rgba(20, 16, 13, 0.25)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        ringDraw: {
          "0%": { strokeDashoffset: 264 },
          "100%": { strokeDashoffset: 0 },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-out forwards",
        ringDraw: "ringDraw 1.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
