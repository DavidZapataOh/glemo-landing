import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#1A1A1A",
        elementBackground: "#2C2C2C", 
        primary: "#00C896",
        primaryHover: '#00E6A0',
        secondary: "#A855F7",
        text: "#FFFFFF",
        textSecondary: "#A8A8A8", 
        accent: "#FF4C4C",
        accentHover: '#FFC700',
        error: '#FF4C4C',
        success: '#00FFB0',
      },
    },
  },
  plugins: [],
};

export default config;
