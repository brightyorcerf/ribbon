import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sanrio-inspired palette
        'sanrio-red': '#E60012',
        'sanrio-pink': '#FFB3D9',
        'sanrio-lavender': '#B19CD9',
        'chocolate': '#3D2817',
        'cream': '#FFF8E7',
      },
      fontFamily: {
        // We'll add custom fonts later
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        // Hard drop shadows (no blur!)
        'hard': '8px 8px 0px #000',
        'hard-sm': '4px 4px 0px #000',
        'hard-lg': '12px 12px 0px #000',
        'hard-chocolate': '8px 8px 0px #3D2817',
      },
      borderRadius: {
        'chunky': '30px',
        'mega': '50px',
      },
    },
  },
  plugins: [],
};
export default config;