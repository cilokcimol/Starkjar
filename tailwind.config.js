/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Amber/copper accent — not cyan, not purple
        ax: {
          50:  "#fdf8ec",
          100: "#f9eed0",
          200: "#f3d99d",
          300: "#ecc065",
          400: "#e6a832",
          500: "#d4900f", // primary amber
          600: "#b87208",
          700: "#8f5508",
          800: "#6b3d0a",
          900: "#4a2a08",
        },
        // Neutral — warm-tinted dark
        void: {
          50:  "#f2f2f5",
          100: "#d4d5dc",
          200: "#a9abbe",
          300: "#7e82a0",
          400: "#565a7a",
          500: "#353856",
          600: "#21233c",
          700: "#161828",
          800: "#0f1020",
          900: "#0a0b19",
          950: "#060713",
        },
      },
      animation: {
        "fade-in":   "fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up":  "slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "scan":      "scan 8s linear infinite",
        "blink":     "blink 1.2s step-end infinite",
        "appear":    "appear 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        appear: {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
